import { IAccountRepository } from "../../application/interfaces/IAccountRepository";
import { Account } from "../../domain/entities/Account";

export class InMemoryAccountRepository implements IAccountRepository {
  private db = new Map<string, Account>(); // our fake "DB"

  constructor(seed: Account[] = []) {
    seed.forEach((a) => this.db.set(a.id, a));
  }

  async findById(id: string): Promise<Account | null> {
    return this.db.get(id) ?? null;
  }

  async save(account: Account): Promise<void> {
    this.db.set(account.id, account);
  }

  async findAll(): Promise<Account[]> {
    return [...this.db.values()];
  }
}
