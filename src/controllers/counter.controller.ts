import { Request, Response } from "express";
import { ICounter } from "../models/counter.model";
import { IResponseDto } from "../models/response.model";
import * as counterService from "../services/counter.service";

export const getCounters = async (req: Request, res: Response) => {
  const counters = await counterService.getCounters();
  res.send(counters);
};

export const getCounterById = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  const id = req.params.id;
  try {
    const counter = await counterService.getCounterById(id);
    if (!!counter) {
      res.send(counter);
    } else {
      res.json({ status: `Данного счетчика ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
};

export const getCountersByPropertyId = async (
  req: Request<{}, {}, { propertyId: number }>,
  res: Response<IResponseDto<ICounter>>
) => {
  const propertyId = req.body.propertyId;

  try {
    const counters = await counterService.getCountersByPropertyId(propertyId);
    if (!!counters.length) {
      // @ts-ignore
      res.status(200).json({ status: "success", data: counters });
    } else {
      res.status(200).json({
        status: "success",
        data: [],
        message: "No counters by propertyId found",
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "success",
      data: [],
      message: "No counters by propertyId found",
    });

    // const respData = counter.filter((item) => item.propertyId == propertyId);

    // if (!!respData.length) {
    //   res.status(200).json({ status: "success", data: respData });
    // } else {
    //   res.status(200).json({
    //     status: "success",
    //     data: [],
    //     message: "No counters by propertyId found",
    //   });
    // }
  }
};
