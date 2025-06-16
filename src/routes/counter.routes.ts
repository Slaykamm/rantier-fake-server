import { Router } from "express";
import {
  getCounterById,
  getCounters,
  getCountersByPropertyId,
} from "../controllers/counter.controller";
import { getCountersService } from "../services/counter.service";

const counterRouter = Router();

counterRouter.get("/", getCountersService);
counterRouter.get("/:id", getCounterById);
counterRouter.post("/", getCountersByPropertyId);

export default counterRouter;
