import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import * as tenantService from "../services/tenant.service";
import { Tenant } from "../entity/tenant.entity";
import { ISecondaryTenantCreateDto } from "../models/tenant.model";

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

export const getTenantsByPropertyId = async (
  req: Request<{}, {}, { propertyId: number }>,
  res: Response<IResponseDto<Tenant>>
) => {
  try {
    const propertyId = req?.body?.propertyId;

    const respData = await tenantService.getTenantsByPropertyId(propertyId);
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

export const createTenant = async (
  req: Request<{}, {}, ISecondaryTenantCreateDto>,
  res: Response<IResponseDto<Tenant>>
) => {
  try {
    const result = await tenantService.createTenantAction(req?.body);
    if (!!result?.success) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(500).json({ status: "error" });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error with creating secondary tenant",
    });
  }
};

export const deleteTenant = async (
  req: Request<{}, {}, { tenantId: number }>,
  res: Response<IResponseDto<Tenant>>
) => {
  try {
    const result = await tenantService.deleteTenantAction(req?.body?.tenantId);
    if (!!result?.success) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(500).json({ status: "error" });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error with deleting secondary tenant",
    });
  }
};
