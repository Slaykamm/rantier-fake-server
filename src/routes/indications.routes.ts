import { Router } from "express";
import {
  createIndication,
  getIndications,
  getIndicationsById,
  postIndicationsByCounterId,
} from "../controllers/indications.controller";
import { authenticate } from "../auth/auth";

const indicationsRouter = Router();

indicationsRouter.get("/", authenticate, getIndications);

// @ts-ignore
indicationsRouter.get("/:id", authenticate, getIndicationsById);

indicationsRouter.post("/", authenticate, postIndicationsByCounterId);
indicationsRouter.post("/create", authenticate, createIndication);

export default indicationsRouter;
