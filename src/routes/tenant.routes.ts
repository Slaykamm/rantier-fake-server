import { Router } from "express";
import {
  getTenantById,
  getTenants,
  getTenantsByRentId,
} from "../controllers/tenant.controller";

const tenantRouter = Router();

tenantRouter.get("/", getTenants);
tenantRouter.get("/:id", getTenantById);
tenantRouter.post("/", getTenantsByRentId);

export default tenantRouter;
