import { Router } from "express";
import {
  createTransactionsByRentId,
  deleteTransactionById,
  getTransactions,
  getTransactionsByRentId,
  getTransactionsHistoryByRentId,
} from "../controllers/transactions.controller";
import { authenticate } from "../auth/auth";

const transactionRouter = Router();

transactionRouter.get("/", authenticate, getTransactions);
transactionRouter.post("/", authenticate, getTransactionsByRentId);
transactionRouter.post(
  "/history",
  authenticate,
  getTransactionsHistoryByRentId
);
// @ts-ignore
transactionRouter.delete("/:id", authenticate, deleteTransactionById);
transactionRouter.post("/create", authenticate, createTransactionsByRentId);

export default transactionRouter;
