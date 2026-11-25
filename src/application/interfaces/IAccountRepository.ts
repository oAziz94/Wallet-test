import { Account } from "../../domain/entities/Account";

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}
