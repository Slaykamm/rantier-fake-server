import { Router } from "express";
import {
  getRentById,
  getRentByPropertyId,
  getRents,
} from "../controllers/rent.controller";
import { authenticate } from "../auth/auth";

const rentRouter = Router();

rentRouter.get("/", authenticate, getRents);
// @ts-ignore
rentRouter.get("/:id", authenticate, getRentById);
rentRouter.post("/", authenticate, getRentByPropertyId);

export default rentRouter;
