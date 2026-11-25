export class Account {
  constructor(
    public readonly id: string,
    private _balance: number,
    private _isActive: boolean = true,
  ) {
    if (!Number.isFinite(_balance))
      throw new Error("Balance must be a valid number");
    if (_balance < 0) throw new Error("Balance cannot be negative");
  }

  get balance(): number {
    return this._balance;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }

  withdraw(amount: number): void {
    this.ensureActive();
    if (amount <= 0) throw new Error("Amount must be positive");
    if (amount > this._balance) throw new Error("Insufficient funds");
    this._balance -= amount;
  }

  deposit(amount: number): void {
    this.ensureActive();
    if (amount <= 0) throw new Error("Amount must be positive");
    this._balance += amount;
  }

  private ensureActive(): void {
    if (!this._isActive) throw new Error(`Account ${this.id} is not active`);
  }
}
