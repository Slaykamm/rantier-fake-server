import { Router } from "express";
import { getTransactionsByRentId } from "../controllers/transactions.controller";

const treansactionRouter = Router();

treansactionRouter.post("/", getTransactionsByRentId);

export default treansactionRouter;
