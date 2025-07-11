import { Router } from "express";
import {
  createTenant,
  getTenantById,
  getTenants,
  getTenantsByPropertyId,
} from "../controllers/tenant.controller";
import { authenticate } from "../auth/auth";

const tenantRouter = Router();

tenantRouter.get("/", authenticate, getTenants);

// @ts-ignore
tenantRouter.get("/:id", authenticate, getTenantById);
tenantRouter.post("/", authenticate, getTenantsByPropertyId);
tenantRouter.post("/create", authenticate, createTenant);

export default tenantRouter;
