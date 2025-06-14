import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import { IProperty } from "../models/property.model";
const property: IProperty[] = require("../../mocks/property.json");

export const getProperty = (
  req: Request,
  res: Response<IResponseDto<IProperty>>
) => {
  try {
    res.status(200).json({ status: "success", data: property });
  } catch {
    res.status(500).json({
      status: "error",
      message: `No properties found in database`,
    });
  }
};

export const getPropertyById = (
  req: Request<{ id: number }>,
  res: Response<IResponseDto<IProperty>>
) => {
  const id = req.params.id;
  try {
    if (property[Number(id) - 1]) {
      res
        .status(200)
        .json({ status: "success", data: [property[Number(id) - 1]] });
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
