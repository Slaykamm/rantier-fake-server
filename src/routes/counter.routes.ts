import { Router } from "express";
import {
  getCounterById,
  getCounters,
  getCountersByPropertyId,
} from "../controllers/counter.controller";

const counterRouter = Router();

counterRouter.get("/", getCounters);
counterRouter.get("/:id", getCounterById);
counterRouter.post("/", getCountersByPropertyId);

export default counterRouter;
