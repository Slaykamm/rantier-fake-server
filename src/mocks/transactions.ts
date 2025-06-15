import { ITransactions } from "../models/transactions.model";

export const transactions: ITransactions[] = [
  {
    id: 1,
    createAt: "2025-01-01",
    rentId: 1,
    amount: 45000.0,
    kindOfPayment: "main",
    type: "invoice",
  },
  {
    id: 2,
    createAt: "2025-01-01",
    rentId: 1,
    amount: 8000.0,
    kindOfPayment: "service",
    type: "invoice",
  },
  {
    id: 3,
    createAt: "2025-01-01",
    rentId: 1,
    amount: 41000.0,
    kindOfPayment: "main",
    type: "payment",
  },
  {
    id: 4,
    createAt: "2025-01-01",
    rentId: 1,
    amount: 12000.0,
    kindOfPayment: "service",
    type: "payment",
  },
];
