export declare class EnvelopeEncryption {
    private readonly masterKey;
    constructor(masterKeyHex: string);
    private generateDek;
    private encryptDek;
    private decryptDek;
    encrypt(plaintext: string): string;
    decrypt(ciphertext: string): string;
}
export declare function hashPayload(payload: Record<string, unknown>): string;
export declare function computeHashChain(previousHash: string, entryData: string): string;
//# sourceMappingURL=encryption.d.ts.map