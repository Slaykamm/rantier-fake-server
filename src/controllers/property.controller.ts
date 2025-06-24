import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import * as properyService from "../services/property.service";
import { Property } from "../entity/property.entity";

export const getProperty = async (
  req: Request,
  res: Response<IResponseDto<Property>>
) => {
  try {
    const properties = await properyService.getPropertiesByUserId(
      req?.user?.email || ""
    );
    res.status(200).json({ status: "success", data: properties });
  } catch {
    res.status(500).json({
      status: "error",
      message: `No properties found in database`,
    });
  }
};

export const getPropertyById = async (
  req: Request<{ id: number }>,
  res: Response<IResponseDto<Property>>
) => {
  const id = req.params.id;
  try {
    const property = await properyService.getPropertyById(id);
    if (!!property?.length) {
      res.status(200).json({ status: "success", data: property });
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
