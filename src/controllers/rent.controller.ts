import { Request, Response } from "express";
import { IRent } from "../models/rent.model";
import { IResponseDto } from "../models/response.model";
const rent: IRent[] = require("../../mocks/rent.json");

export const getRents = (req: Request, res: Response<IResponseDto<IRent>>) => {
  try {
    res.status(200).json({ status: "success", data: rent });
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `No Rents found in database` });
  }
};

export const getRentById = (
  req: Request<{ id: number }>,
  res: Response<IResponseDto<IRent>>
) => {
  const id = req.params.id;
  try {
    if (rent[Number(id) - 1]) {
      res.status(200).json({ status: "success", data: [rent[Number(id) - 1]] });
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

export const getRentByPropertyId = (
  req: Request<{}, {}, { propertyId: number }>,
  res: Response<IResponseDto<IRent>>
) => {
  try {
    const search = rent.find(
      (item) =>
        item.propertyId === req.body.propertyId &&
        !!item.isActiveRent &&
        new Date() < new Date(item.endContractDate)
    );
    if (!!search) {
      res.status(200).json({ status: "success", data: [search] });
    } else {
      res.status(500).json({
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
