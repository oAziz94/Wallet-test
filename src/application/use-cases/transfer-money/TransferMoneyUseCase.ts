// USE CASES (red circle)
// Orchestrates the entities. Depends only on the Domain + the repository interface.

import { IAccountRepository } from "../../interfaces/IAccountRepository";
import { TransferMoneyCommand } from "./TransferMoneyCommand";

export class TransferMoneyUseCase {
  constructor(private readonly accounts: IAccountRepository) {}

  async execute(command: TransferMoneyCommand): Promise<void> {
    const { fromAccountId, toAccountId, amount } = command;

    if (fromAccountId === toAccountId) {
      throw new Error("Cannot transfer to the same account");
    }

    const from = await this.accounts.findById(fromAccountId);
    const to = await this.accounts.findById(toAccountId);
    if (!from || !to) throw new Error("Account not found");

    from.withdraw(amount); // business rules live in the entity
    to.deposit(amount);

    await this.accounts.save(from);
    await this.accounts.save(to);
  }
}
