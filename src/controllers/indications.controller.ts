import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import { IIndications } from "../models/indications.model";
const indications: IIndications[] = require("../../mocks/indications.json");

export const getIndications = (req: Request, res: Response) => {
  res.send(indications);
};
export const getIndicationsById = (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (indications[Number(id) - 1]) {
      res.send(indications[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
};

export const postIndicationsByCounterId = (
  req: Request<{}, {}, { counterId: number }>,
  res: Response<IResponseDto<IIndications>>
) => {
  try {
    const counterId = req.body?.counterId;
    const indicationsFilteredByCounterId = indications?.filter(
      (indication: any) => indication.counterId == counterId
    );

    if (indicationsFilteredByCounterId?.length) {
      const orderedFilteredIndications = indicationsFilteredByCounterId.sort(
        // @ts-ignore
        (a, b) => new Date(b.createAt) - new Date(a.createAt)
      );

      const twoLatestIndications = [
        orderedFilteredIndications?.[0],
        orderedFilteredIndications?.[1],
      ];

      const filteredTwoLatestIndications = twoLatestIndications.filter(
        (item) => !!item
      );
      // @ts-ignore
      if (!!filteredTwoLatestIndications.length) {
        res.status(200).json({
          status: "success",
          data: filteredTwoLatestIndications,
        });
      } else {
        res.status(200).json({
          status: "error",
          message: "No any indications for this counterId",
        });
      }
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
