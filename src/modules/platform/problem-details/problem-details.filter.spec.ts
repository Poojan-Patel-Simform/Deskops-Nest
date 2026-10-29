import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RequestContextService } from '../request-context/index.js';
import { type ProblemDetails, ProblemDetailsFilter } from './problem-details.filter.js';

describe('ProblemDetailsFilter', () => {
  const context = new RequestContextService();
  const filter = new ProblemDetailsFilter(context);

  function run(exception: unknown) {
    let body = {} as ProblemDetails;
    const send = vi.fn((sent: ProblemDetails) => {
      body = sent;
    });
    const type = vi.fn(() => ({ send }));
    const status = vi.fn(() => ({ type }));
    const host = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET', originalUrl: '/v1/things?x=1' }),
        getResponse: () => ({ headersSent: false, status }),
      }),
    };
    context.run({ requestId: 'req-1' }, () => {
      filter.catch(exception, host as never);
    });
    return { status, type, body };
  }

  it('maps an HttpException to problem details with the request ID', () => {
    const { status, type, body } = run(new NotFoundException('No such thing'));
    expect(status).toHaveBeenCalledWith(404);
    expect(type).toHaveBeenCalledWith('application/problem+json');
    expect(body).toEqual({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'No such thing',
      instance: '/v1/things?x=1',
      requestId: 'req-1',
    });
  });

  it('lists message arrays under errors', () => {
    const { body } = run(new BadRequestException(['a is required', 'b must be a number']));
    expect(body.status).toBe(400);
    expect(body.errors).toEqual(['a is required', 'b must be a number']);
  });

  it('hides internals of unknown errors behind a 500', () => {
    const { status, body } = run(new Error('db password is hunter2'));
    expect(status).toHaveBeenCalledWith(500);
    expect(body.title).toBe('Internal Server Error');
    expect(JSON.stringify(body)).not.toContain('hunter2');
  });
});
