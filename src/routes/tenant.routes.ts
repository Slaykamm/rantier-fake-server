import { Router } from "express";
import {
  getTenantById,
  getTenants,
  getTenantsByRentId,
} from "../controllers/tenant.controller";
import { authenticate } from "../auth/auth";

const tenantRouter = Router();

tenantRouter.get("/", authenticate, getTenants);

// @ts-ignore
tenantRouter.get("/:id", authenticate, getTenantById);
tenantRouter.post("/", authenticate, getTenantsByRentId);

export default tenantRouter;
