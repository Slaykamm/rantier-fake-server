import { Router } from "express";
import counterRouter from "./counter.routes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Привет, это простой сервер на Express!");
});

router.use("/counter", counterRouter);
// router.use("/indications", indicationsRouter);
// router.use("/property", propertyRouter);
// router.use("/rent", rentRouter);
// router.use("/service_company", serviceCompanyRouter);
// router.use("/tenant", tenantRouter);
// router.use("/transactions", transactionsRouter);

export default router;
