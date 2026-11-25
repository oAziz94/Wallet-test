import express from "express";
import { Account } from "./domain/entities/Account";
import { InMemoryAccountRepository } from "./infrastructure/repositories/InMemoryAccountRepository";
import { TransferMoneyUseCase } from "./application/use-cases/transfer-money/TransferMoneyUseCase";
import { TransferController } from "./presentation/controllers/TransferController";

const accountRepo = new InMemoryAccountRepository([
  new Account("1", 1000),
  new Account("2", 500),
]);

const transferMoney = new TransferMoneyUseCase(accountRepo);

const transferController = new TransferController(transferMoney);

const app = express();
app.use(express.json());

app.post("/transfer", transferController.postTransfer);

app.get("/accounts", async (_req, res) => {
  const accounts = await accountRepo.findAll();
  res.json(accounts.map((a) => ({ id: a.id, balance: a.balance })));
});

app.listen(3000, () =>
  console.log("Wallet API running on http://localhost:3000"),
);
