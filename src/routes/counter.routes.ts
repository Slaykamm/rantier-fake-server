import { Router } from "express";
import {
  createCounter,
  deleteCounter,
  getCounterById,
  getCounters,
  getCountersByPropertyId,
} from "../controllers/counter.controller";
import { authenticate } from "../auth/auth";

const counterRouter = Router();

counterRouter.get("/", authenticate, getCounters);
// @ts-ignore
counterRouter.get("/:id", authenticate, getCounterById);
counterRouter.post("/", authenticate, getCountersByPropertyId);
counterRouter.post("/create", authenticate, createCounter);
counterRouter.post("/delete", authenticate, deleteCounter);

export default counterRouter;
