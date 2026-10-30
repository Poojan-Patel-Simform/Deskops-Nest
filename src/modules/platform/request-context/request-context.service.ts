import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';
import type { RequestContextStore } from './request-context.types.js';

/** Per-request state carried across async boundaries without threading it through call signatures. */
@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextStore>();

  run<T>(store: RequestContextStore, fn: () => T): T {
    return this.storage.run(store, fn);
  }

  get(): RequestContextStore | undefined {
    return this.storage.getStore();
  }

  get requestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }
}
