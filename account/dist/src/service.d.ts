import type { CreateAccountInput } from '@novapay/shared';
export interface DecryptedAccount {
    id: string;
    userId: string;
    currency: string;
    balance: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AccountService {
    createAccount(input: CreateAccountInput): Promise<DecryptedAccount>;
    getAccount(id: string): Promise<DecryptedAccount>;
    getAccountsByUser(userId: string): Promise<DecryptedAccount[]>;
    updateBalance(id: string, amount: string, type: 'CREDIT' | 'DEBIT'): Promise<DecryptedAccount>;
    getBalance(id: string): Promise<string>;
}
export declare const accountService: AccountService;
//# sourceMappingURL=service.d.ts.map