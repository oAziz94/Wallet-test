import { Request, Response } from "express";
import { TransferMoneyUseCase } from "../../application/use-cases/transfer-money/TransferMoneyUseCase";

export class TransferController {
  constructor(private readonly transferMoney: TransferMoneyUseCase) {}

  postTransfer = async (req: Request, res: Response) => {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;
      await this.transferMoney.execute({
        fromAccountId,
        toAccountId,
        amount: Number(amount),
      });
      res.json({ message: "Transfer successful" });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
}
