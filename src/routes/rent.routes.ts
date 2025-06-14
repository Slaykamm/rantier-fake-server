import { Router } from "express";
import {
  getRentById,
  getRentByPropertyId,
  getRents,
} from "../controllers/rent.controller";

const rentRouter = Router();

rentRouter.get("/", getRents);
rentRouter.get("/:id", getRentById);
rentRouter.post("/", getRentByPropertyId);

export default rentRouter;
