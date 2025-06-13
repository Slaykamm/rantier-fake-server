import { Router } from "express";
// import {
//   getCounters,
//   getCounterById,
//   getCountersByPropertyId,
// } from "../controllers/counter.controller";
// import counter from "../mocks/counter.json";
import {
  getCounterById,
  getCounters,
  getCountersByPropertyId,
} from "../controllers/counter.controller";

const counterRouter = Router();

counterRouter.get("/", getCounters);
counterRouter.get("/:id", getCounterById);
// counterRouter.post("/", getCountersByPropertyId);

export default counterRouter;
