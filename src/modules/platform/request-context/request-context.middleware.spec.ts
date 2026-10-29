import { RequestContextMiddleware, resolveRequestId } from './request-context.middleware.js';
import { RequestContextService } from './request-context.service.js';

describe('resolveRequestId', () => {
  it('keeps a well-formed inbound ID', () => {
    expect(resolveRequestId('abc-123_X.y')).toBe('abc-123_X.y');
  });

  it('generates one when absent, malformed or too long', () => {
    const uuid = /^[0-9a-f-]{36}$/;
    expect(resolveRequestId(undefined)).toMatch(uuid);
    expect(resolveRequestId('bad id\r\n')).toMatch(uuid);
    expect(resolveRequestId('a'.repeat(129))).toMatch(uuid);
  });
});

describe('RequestContextMiddleware', () => {
  const context = new RequestContextService();
  const middleware = new RequestContextMiddleware(context);

  function handle(headers: Record<string, string>) {
    const setHeader = vi.fn();
    let seen: string | undefined;
    middleware.use({ headers } as never, { setHeader } as never, () => {
      seen = context.requestId;
    });
    return { setHeader, seen };
  }

  it('exposes the ID to downstream code and echoes it on the response', () => {
    const { setHeader, seen } = handle({ 'x-request-id': 'req-1' });
    expect(seen).toBe('req-1');
    expect(setHeader).toHaveBeenCalledWith('x-request-id', 'req-1');
  });

  it('has no context outside a request', () => {
    handle({});
    expect(context.get()).toBeUndefined();
  });
});
