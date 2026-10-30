import { Inject, Injectable } from '@nestjs/common';
import { APP_CONFIG } from './config.constants.js';
import type { AppConfig } from './env.schema.js';

@Injectable()
export class ConfigService {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }
}
