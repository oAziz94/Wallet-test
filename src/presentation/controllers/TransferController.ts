// CONTROLLERS (green circle)
// Translates HTTP request -> use case command, and result -> HTTP response.
// No business logic here.

import { Request, Response } from "express";
import { TransferMoneyUseCase } from "../../application/use-cases/transfer-money/TransferMoneyUseCase";

export class TransferController {
  constructor(private readonly transferMoney: TransferMoneyUseCase) {}

  handle = async (req: Request, res: Response) => {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;
      await this.transferMoney.execute({ fromAccountId, toAccountId, amount: Number(amount) });
      res.json({ message: "Transfer successful" });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
}
