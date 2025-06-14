import { Router } from "express";
import {
  getIndications,
  getIndicationsById,
  postIndicationsByCounterId,
} from "../controllers/indications.controller";

const indicationsRouter = Router();

indicationsRouter.get("/", getIndications);

indicationsRouter.get("/:id", getIndicationsById);

indicationsRouter.post("/", postIndicationsByCounterId);

export default indicationsRouter;
