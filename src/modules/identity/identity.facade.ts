import { Injectable } from '@nestjs/common';

/** Public surface of the identity module; other modules depend on this, nothing else. */
@Injectable()
export class IdentityFacade {}
