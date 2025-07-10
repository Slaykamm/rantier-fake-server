import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import * as properyService from "../services/property.service";
import { Property } from "../entity/property.entity";
import { IPropertyCreateDto } from "../models/property.model";

export const getProperty = async (
  req: Request,
  res: Response<IResponseDto<Property>>
) => {
  try {
    console.log("test req", req?.user?.firebase?.identities.email?.[0]);
    const properties = await properyService.getPropertiesByUserId(
      req?.user?.email || ""
    );
    // @ts-ignore
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

export const createProperty = async (
  req: Request<IPropertyCreateDto>,
  res: Response<IResponseDto<Property>>
) => {
  try {
    const userId = req?.user?.email || "";
    if (!userId) {
      return res.status(500).json({
        status: "error",
        message: `No token provided`,
      });
    }

    console.log("test req", req?.user?.firebase?.identities.email?.[0]);
    const respData = await properyService.createPropertyAction({
      ...req?.body,
      userEmail: req?.user?.email || "",
    });
    if (!!respData.success) {
      res.status(200).json({
        status: "success",
        //@ts-ignore
        data: [respData.data],
      });
    } else {
      res.status(500).json({
        status: "error",
        message: `Something went wrong with PropertyCreation`,
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Something went wrong with PropertyCreation ${e}`,
    });
  }
};
