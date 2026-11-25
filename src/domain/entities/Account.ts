export class Account {
  constructor(
    public readonly id: string,
    private _balance: number,
  ) {}

  get balance(): number {
    return this._balance;
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    if (amount > this._balance) throw new Error("Insufficient funds");
    this._balance -= amount;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    this._balance += amount;
  }
}
