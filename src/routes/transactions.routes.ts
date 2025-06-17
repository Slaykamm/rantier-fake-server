import { Router } from "express";
import {
  getTransactions,
  getTransactionsByRentId,
} from "../controllers/transactions.controller";

const treansactionRouter = Router();

treansactionRouter.get("/", getTransactions);
treansactionRouter.post("/", getTransactionsByRentId);

export default treansactionRouter;
