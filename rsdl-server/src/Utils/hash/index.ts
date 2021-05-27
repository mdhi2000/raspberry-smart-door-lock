import * as crypto from 'crypto';

const sha512hasher = crypto.createHmac(
  'sha512',
  'd22101d5d402ab181a66b71bb950ff2892f6d2a1e436d61c4fb1011e9c49a77a',
);

export const createSHA512Hash = (str: string): string => {
  return sha512hasher.update(str).digest('hex');
};
