"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvelopeEncryption = void 0;
exports.hashPayload = hashPayload;
exports.computeHashChain = computeHashChain;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
class EnvelopeEncryption {
    masterKey;
    constructor(masterKeyHex) {
        if (!masterKeyHex || masterKeyHex.length !== 64) {
            throw new Error('Master key must be a 64-character hex string (32 bytes)');
        }
        this.masterKey = Buffer.from(masterKeyHex, 'hex');
    }
    generateDek() {
        return crypto_1.default.randomBytes(32);
    }
    encryptDek(dek) {
        const iv = crypto_1.default.randomBytes(IV_LENGTH);
        const cipher = crypto_1.default.createCipheriv(ALGORITHM, this.masterKey, iv);
        const encrypted = Buffer.concat([cipher.update(dek), cipher.final()]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([iv, tag, encrypted]).toString('base64');
    }
    decryptDek(encryptedDek) {
        const buf = Buffer.from(encryptedDek, 'base64');
        const iv = buf.subarray(0, IV_LENGTH);
        const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
        const data = buf.subarray(IV_LENGTH + TAG_LENGTH);
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, this.masterKey, iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(data), decipher.final()]);
    }
    encrypt(plaintext) {
        const dek = this.generateDek();
        const dekEncrypted = this.encryptDek(dek);
        const iv = crypto_1.default.randomBytes(IV_LENGTH);
        const cipher = crypto_1.default.createCipheriv(ALGORITHM, dek, iv);
        const encrypted = Buffer.concat([
            cipher.update(plaintext, 'utf8'),
            cipher.final(),
        ]);
        const tag = cipher.getAuthTag();
        const payload = {
            iv: iv.toString('base64'),
            tag: tag.toString('base64'),
            data: encrypted.toString('base64'),
            dekEncrypted,
        };
        return JSON.stringify(payload);
    }
    decrypt(ciphertext) {
        const payload = JSON.parse(ciphertext);
        const dek = this.decryptDek(payload.dekEncrypted);
        const iv = Buffer.from(payload.iv, 'base64');
        const tag = Buffer.from(payload.tag, 'base64');
        const data = Buffer.from(payload.data, 'base64');
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, dek, iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
    }
}
exports.EnvelopeEncryption = EnvelopeEncryption;
function hashPayload(payload) {
    const sorted = JSON.stringify(payload, Object.keys(payload).sort());
    return crypto_1.default.createHash('sha256').update(sorted).digest('hex');
}
function computeHashChain(previousHash, entryData) {
    return crypto_1.default.createHash('sha256')
        .update(previousHash + entryData)
        .digest('hex');
}
//# sourceMappingURL=encryption.js.map