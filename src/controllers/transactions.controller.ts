import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import { ITransactionsResponseDto } from "../models/transactions.model";
import * as transactionService from "../services/transactions.service";

export const getTransactions = async (req: Request, res: Response) => {
  const respData = await transactionService.getTransactions();
  res.send(respData);
};

export const getTransactionsByRentId = async (
  req: Request<{}, {}, { rentId: number }>,
  res: Response<IResponseDto<ITransactionsResponseDto>>
) => {
  const rentId = req.body.rentId;

  try {
    const respData = await transactionService.getTransactionsByRentId(rentId);

    res.status(200).json({
      status: "success",
      data: [respData],
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Transactions Service internal Error ${e}`,
    });
  }
};
