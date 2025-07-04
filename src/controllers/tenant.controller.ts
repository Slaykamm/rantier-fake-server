import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import * as tenantService from "../services/tenant.service";
import { Tenant } from "../entity/tenant.entity";

export const getTenants = async (req: Request, res: Response) => {
  const tenantsData = await tenantService.getTenants();
  res.send(tenantsData);
};
export const getTenantById = async (
  req: Request<{ id: number }>,
  res: Response<IResponseDto<Tenant>>
) => {
  const id = req.params.id;
  try {
    const tenantData = await tenantService.getTenantById(id);
    if (!!tenantData.length) {
      res.status(200).json({ status: "success", data: tenantData });
    } else {
      res
        .status(200)
        .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
  }
};

export const getTenantsByRentId = async (
  req: Request<{}, {}, { rentId: number }>,
  res: Response<IResponseDto<Tenant>>
) => {
  try {
    const rentId = req?.body?.rentId;
    const respData = await tenantService.getTenantsByRentId(rentId);
    if (!!respData.length) {
      res.status(200).json({ status: "success", data: respData });
    } else {
      res.status(200).json({
        status: "error",
        message: "No active rent for this property",
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "No active rent for this property",
    });
  }
};
