import { Request, Response } from "express";
import { ICounter } from "../models/counter.model";
import { IResponseDto } from "../models/response.model";
const counter: ICounter[] = require("../../mocks/counter.json");

export const getCounters = (req: Request, res: Response) => {
  res.send(counter);
};

export const getCounterById = (req: Request<{ id: number }>, res: Response) => {
  const id = req.params.id;
  try {
    if (counter[Number(id) - 1]) {
      res.send(counter[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
};

export const getCountersByPropertyId = (
  req: Request<{}, {}, { propertyId: number }>,
  res: Response<IResponseDto<ICounter>>
) => {
  const propertyId = req.body.propertyId;
  const respData = counter.filter((item) => item.propertyId == propertyId);

  if (!!respData.length) {
    return res.status(200).json({ status: "success", data: respData });
  }
  return res.status(200).json({
    status: "success",
    data: [],
    message: "No counters by propertyId found",
  });
};
