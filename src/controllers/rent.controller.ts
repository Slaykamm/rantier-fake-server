import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import * as rentService from "../services/rent.service";
import { Rent } from "../entity/rent.entity";
import { IRentCreateDto } from "../models/rent.model";

export const getRents = async (
  req: Request,
  res: Response<IResponseDto<Rent>>
) => {
  try {
    const rents = await rentService.getRents();
    res.status(200).json({ status: "success", data: rents });
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `No Rents found in database` });
  }
};

export const getRentById = async (
  req: Request<{ id: number }>,
  res: Response<IResponseDto<Rent>>
) => {
  const id = req.params.id;
  try {
    const rent = await rentService.getRentById(id);
    if (!!rent?.length) {
      res.status(200).json({ status: "success", data: rent });
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

export const getRentByPropertyId = async (
  req: Request<{}, {}, { propertyId: number }>,
  res: Response<IResponseDto<Rent>>
) => {
  try {
    const propertyId = req.body.propertyId;
    const search = await rentService.getRentByPropertyId(propertyId);
    if (!!search) {
      res.status(200).json({ status: "success", data: [search] });
    } else {
      res.status(200).json({
        status: "error",
        message: "No active rent for this property",
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `No active rent for this property ${e}`,
    });
  }
};

export const createRentByProperyId = async (
  req: Request<{}, {}, IRentCreateDto>,
  res: Response<IResponseDto<Rent>>
) => {
  try {
    const result = await rentService.createRentByProperyIdAction(req.body);
    if (!!result?.success) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(200).json({
        status: "error",
        message: result?.message,
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `No active rent for this property ${e}`,
    });
  }
};
