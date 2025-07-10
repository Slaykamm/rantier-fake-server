import { Router } from "express";
import {
  createRentByProperyId,
  finishRentByPropertyId,
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
rentRouter.post("/create", authenticate, createRentByProperyId);
rentRouter.post("/finish", authenticate, finishRentByPropertyId);

export default rentRouter;
