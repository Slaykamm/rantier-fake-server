import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import * as counterService from "../services/counter.service";
import { Counter } from "../entity/counter.entity";
import { ICounterCreateDto } from "../models/counter.model";

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
  res: Response<IResponseDto<Counter>>
) => {
  const propertyId = req.body.propertyId;

  try {
    const counters = await counterService.getCountersByPropertyId(propertyId);
    if (!!counters.length) {
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
  }
};

export const createCounter = async (
  req: Request<{}, {}, ICounterCreateDto>,
  res: Response<IResponseDto<Counter>>
) => {
  const propertyId = req.body.propertyId;

  try {
    if (!!propertyId) {
      const counter = await counterService.createCounterAction(req.body);
      if (!!counter.success) {
        res.status(200).json({ status: "success" });
      }
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error with counter creation",
    });
  }
};

export const deleteCounter = async (
  req: Request<{}, {}, { counterId: number }>,
  res: Response<IResponseDto<Counter>>
) => {
  const counterId = req.body.counterId;

  try {
    if (!!counterId) {
      const counter = await counterService.deleteCounterAction(counterId);
      if (!!counter.success) {
        res.status(200).json({ status: "success" });
      }
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error with counter deleting",
    });
  }
};
