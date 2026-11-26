# Wallet App

I made this to practice Clean Architecture. The original example was done in .NET, so I rebuilt it in TypeScript to make sure I actually understood it and wasn't just copying it.

It's intentionally tiny. There's one entity (an account) and one use case (transferring money between two accounts). There's no real database either, everything is kept in memory and resets when you restart the server.

## Running it

```
npm install
npm run dev
```

Then it's on `http://localhost:3000`:

- `POST /transfer` with something like `{ "fromAccountId": "1", "toAccountId": "2", "amount": 200 }`
- `GET /accounts` to check the balances

Two accounts are created at startup in `main.ts`: account `1` with 1000 and account `2` with 500 to help me quickly test my implementation.

## How it's structured

There are four layers, and the main rule is that a layer only imports from itself or from a layer further in. Never outward.

### Domain

`src/domain/entities/Account.ts`

This is the center and it doesn't import anything. `Account` has an `id`, a `balance` and an `isActive` flag.

I put all the money rules in here on purpose:

- you can't create an account with a negative (or NaN) balance
- `withdraw()` and `deposit()` only accept positive amounts
- `withdraw()` fails if there isn't enough money
- both of them fail if the account is inactive

The balance is private, so the only way to change it is through those two methods. There's also `activate()` and `deactivate()`.

### Application

`src/application`

The transfer use case lives here, along with the repository interface it needs.

`IAccountRepository` only has `findById()` and `save()`. The use case doesn't know or care where accounts are actually stored, it just talks to this interface.

`TransferMoneyCommand` is the input (`fromAccountId`, `toAccountId`, `amount`), and `TransferMoneyUseCase` does the actual work. It gets the repository through its constructor instead of creating one itself.

Imports: `IAccountRepository` imports `Account`. The use case imports the interface and the command. Nothing in here imports Express or the in-memory repo.

### Infrastructure

`src/infrastructure/repositories/InMemoryAccountRepository.ts`

The actual storage, which is just a `Map`. It implements `IAccountRepository`, so it imports that interface plus `Account`.

This is the part that clicked for me. The data goes out to storage, but the import points inward, because this class depends on an interface owned by the application layer. If I wanted Postgres later, I'd write another class that implements the same interface, and the use case wouldn't change at all.

It also has a `findAll()` that only the `GET /accounts` route uses.

### Presentation

`src/presentation/controllers/TransferController.ts`

Reads the request body, turns it into a command and calls the use case. It imports `TransferMoneyUseCase` and Express's `Request`/`Response` types. No business logic here.

### main.ts

Everything gets wired together here: create the repo, pass it to the use case, pass the use case to the controller, register the routes. It's the only file that imports from every layer, which is fine because that's its whole job.

## What happens when you transfer

1. Express gets `POST /transfer` and calls `TransferController.postTransfer()`
2. the controller pulls `fromAccountId`, `toAccountId` and `amount` from the body and calls `TransferMoneyUseCase.execute()`
3. the use case makes sure you're not sending money to the same account
4. it loads both accounts with `findById()` and throws "Account not found" if one is missing
5. it calls `from.withdraw(amount)` then `to.deposit(amount)`, which is where the actual checks happen
6. it saves both with `save()`
7. the controller returns `200`, or `400` with the error message if anything threw along the way
