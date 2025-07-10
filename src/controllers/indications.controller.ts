import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import * as indicationsService from "../services/indications.service";
import { Indications } from "../entity/indications.entity";

export const getIndications = async (req: Request, res: Response) => {
  const indications = await indicationsService.getIndications();
  res.send(indications);
};
export const getIndicationsById = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  const id = req.params.id;
  try {
    const indications = await indicationsService.getIndicationsById(id);
    if (!!indications?.length) {
      res.status(200).send({ status: "success", data: indications });
    } else {
      res.status(200).json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.status(500).json({ status: `Данного ID: ${id} нет в БД` });
  }
};

export const postIndicationsByCounterId = async (
  req: Request<{}, {}, { counterId: number }>,
  res: Response<IResponseDto<Indications>>
) => {
  try {
    const counterId = req.body?.counterId;
    const filteredTwoLatestIndications =
      await indicationsService.postIndicationsByCounterId(counterId);
    if (!!filteredTwoLatestIndications?.length) {
      res.status(200).json({
        status: "success",
        data: filteredTwoLatestIndications,
      });
    } else {
      res.status(200).json({
        status: "success",
        data: [],
        message: "No any indications for this counterId",
      });
    }
  } catch (e) {
    // @ts-ignore
    res.status(500).json({
      status: "error",
      message: String(e),
    });
  }
};
