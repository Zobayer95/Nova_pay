import { EnvelopeEncryption, hashPayload, computeHashChain } from '../encryption';

const TEST_MASTER_KEY = 'a'.repeat(64);

describe('EnvelopeEncryption', () => { 
  let encryption: EnvelopeEncryption;
 
  beforeEach(() => { 
    encryption = new EnvelopeEncryption(TEST_MASTER_KEY); 
  });

  it('encrypts and decrypts strings correctly', () => {
    const plaintext = 'Hello, NovaPay!';
    const ciphertext = encryption.encrypt(plaintext);
    const decrypted = encryption.decrypt(ciphertext);

    expect(decrypted).toBe(plaintext);
  });

  it('produces different ciphertexts for the same plaintext', () => {
    const plaintext = 'same input data';
    const ciphertext1 = encryption.encrypt(plaintext);
    const ciphertext2 = encryption.encrypt(plaintext);

    expect(ciphertext1).not.toBe(ciphertext2);

    // Both should still decrypt to the same plaintext
    expect(encryption.decrypt(ciphertext1)).toBe(plaintext);
    expect(encryption.decrypt(ciphertext2)).toBe(plaintext);
  });

  it('throws on invalid master key length', () => {
    expect(() => new EnvelopeEncryption('short')).toThrow(
      'Master key must be a 64-character hex string (32 bytes)',
    );
    expect(() => new EnvelopeEncryption('')).toThrow(
      'Master key must be a 64-character hex string (32 bytes)',
    );
    expect(() => new EnvelopeEncryption('b'.repeat(63))).toThrow(
      'Master key must be a 64-character hex string (32 bytes)',
    );
    expect(() => new EnvelopeEncryption('c'.repeat(65))).toThrow(
      'Master key must be a 64-character hex string (32 bytes)',
    );
  });
});

describe('hashPayload', () => {
  it('produces consistent hashes for the same input', () => {
    const payload = { amount: '100.00', currency: 'USD', accountId: 'acc-1' };
    const hash1 = hashPayload(payload);
    const hash2 = hashPayload(payload);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex digest
  });

  it('produces different hashes for different input', () => {
    const payload1 = { amount: '100.00', currency: 'USD' };
    const payload2 = { amount: '200.00', currency: 'USD' };

    const hash1 = hashPayload(payload1);
    const hash2 = hashPayload(payload2);

    expect(hash1).not.toBe(hash2);
  });
});

describe('computeHashChain', () => {
  it('produces consistent results for the same inputs', () => {
    const previousHash = 'abc123';
    const entryData = '{"id":"entry-1","amount":"50.00"}';

    const result1 = computeHashChain(previousHash, entryData);
    const result2 = computeHashChain(previousHash, entryData);

    expect(result1).toBe(result2);
    expect(result1).toHaveLength(64);
  });

  it('produces different results for different previous hashes', () => {
    const entryData = '{"id":"entry-1","amount":"50.00"}';

    const result1 = computeHashChain('hash-a', entryData);
    const result2 = computeHashChain('hash-b', entryData);

    expect(result1).not.toBe(result2);
  });

  it('produces different results for different entry data', () => {
    const previousHash = 'abc123';

    const result1 = computeHashChain(previousHash, 'data-1');
    const result2 = computeHashChain(previousHash, 'data-2');

    expect(result1).not.toBe(result2);
  });
});
