import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import { ITenant } from "../models/tenant.model";
const tenant: ITenant[] = require("../../mocks/tenant.json");

export const getTenants = (req: Request, res: Response) => {
  res.send(tenant);
};
export const getTenantById = (
  req: Request<{ id: number }>,
  res: Response<IResponseDto<ITenant>>
) => {
  const id = req.params.id;
  try {
    if (tenant[Number(id) - 1]) {
      res
        .status(200)
        .json({ status: "success", data: [tenant[Number(id) - 1]] });
    } else {
      res
        .status(500)
        .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
  }
};

export const getTenantsByRentId = (
  req: Request<{}, {}, { rentId: number }>,
  res: Response<IResponseDto<ITenant>>
) => {
  try {
    const rentId = req?.body?.rentId;
    const respData = tenant.filter((item) => item.rentId.id == rentId);
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
