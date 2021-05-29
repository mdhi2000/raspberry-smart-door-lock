import * as crypto from 'crypto';

export const createSHA512Hash = (str: string): string => {
  const sha512hasher = crypto.createHmac(
    'sha512',
    'd22101d5d402ab181a66b71bb950ff2892f6d2a1e436d61c4fb1011e9c49a77a',
  );
  return sha512hasher.update(str).digest('hex');
};
