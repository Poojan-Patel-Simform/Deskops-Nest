import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { RequestContextService } from '../request-context/index.js';

/** RFC 9457 problem details, plus the `requestId` extension so clients can quote it in support requests. */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance: string;
  requestId?: string | undefined;
  errors?: string[];
}

export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

const INTERNAL_DETAIL = 'An unexpected error occurred.';

function titleFor(status: number): string {
  const key = HttpStatus[status];
  if (!key) return 'Error';
  return key
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Errors from body-parser and friends (http-errors): not HttpExceptions, but carry a safe client status. */
function clientStatusOf(exception: unknown): number | undefined {
  if (typeof exception !== 'object' || exception === null) return undefined;
  const { status, expose } = exception as { status?: unknown; expose?: unknown };
  return typeof status === 'number' && status >= 400 && status < 500 && expose === true
    ? status
    : undefined;
}

function describe(exception: HttpException): Pick<ProblemDetails, 'detail' | 'errors'> {
  const body = exception.getResponse();
  if (typeof body === 'string') return { detail: body };
  const message = (body as { message?: unknown }).message;
  if (Array.isArray(message)) {
    return { detail: 'The request is invalid.', errors: message.map(String) };
  }
  return { detail: typeof message === 'string' ? message : exception.message };
}

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  constructor(private readonly context: RequestContextService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') throw exception;

    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const requestId = this.context.requestId;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (clientStatusOf(exception) ?? 500);
    const isServerError = status >= 500;

    // Never echo internals for 5xx; the stack goes to the log, keyed by request ID.
    const details = isServerError
      ? { detail: INTERNAL_DETAIL }
      : exception instanceof HttpException
        ? describe(exception)
        : { detail: (exception as Error).message };
    if (isServerError) {
      this.logger.error(
        `${req.method} ${req.originalUrl} -> ${String(status)} [${requestId ?? '-'}]`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const problem: ProblemDetails = {
      type: 'about:blank',
      title: titleFor(status),
      status,
      ...details,
      instance: req.originalUrl,
      requestId,
    };

    if (res.headersSent) return;
    res.status(status).type(PROBLEM_CONTENT_TYPE).send(problem);
  }
}
