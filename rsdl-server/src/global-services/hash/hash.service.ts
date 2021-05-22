import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
  private sha512hasher = crypto.createHmac(
    'sha512',
    'd22101d5d402ab181a66b71bb950ff2892f6d2a1e436d61c4fb1011e9c49a77a',
  );

  createSHA512Hash(str: string): string {
    return this.sha512hasher.update(str).digest('hex');
  }
}
