import { Router } from "express";
import {
  getTransactions,
  getTransactionsByRentId,
} from "../controllers/transactions.controller";
import { authenticate } from "../auth/auth";

const treansactionRouter = Router();

treansactionRouter.get("/", authenticate, getTransactions);
treansactionRouter.post("/", authenticate, getTransactionsByRentId);

export default treansactionRouter;
