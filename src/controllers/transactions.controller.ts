import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import {
  ITransactionCreateDto,
  ITransactions,
  ITransactionsBalanceResponseDto,
} from "../models/transactions.model";
import * as transactionService from "../services/transactions.service";
import { Transactions } from "../entity/transactions.entity";

export const getTransactions = async (req: Request, res: Response) => {
  const respData = await transactionService.getTransactions();
  res.send(respData);
};

export const getTransactionsByRentId = async (
  req: Request<{}, {}, { rentId: number }>,
  res: Response<IResponseDto<ITransactionsBalanceResponseDto>>
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

export const getTransactionsHistoryByRentId = async (
  req: Request<{}, {}, { rentId: number }>,
  res: Response<IResponseDto<Transactions>>
) => {
  const rentId = req.body.rentId;
  try {
    const respData = await transactionService.getTransactionsHistoryByRentId(
      rentId
    );

    res.status(200).json({
      status: "success",
      data: respData,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Transactions Service internal Error ${e}`,
    });
  }
};

export const deleteTransactionById = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  const id = req.params.id;
  try {
    const result = await transactionService.deleteTransactionById(id);
    if (!!result?.success) {
      res.status(204).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: `Данной трназакции нет в БД ${result?.message}`,
      });
    }
  } catch (e) {
    if (e instanceof Error)
      res.status(500).json({
        status: "error",
        message: `Что то пошло не так ${e.toString()}`,
      });
  }
};

export const createTransactionsByRentId = async (
  req: Request<{}, {}, ITransactionCreateDto>,
  res: Response<IResponseDto<Transactions>>
) => {
  try {
    const respData = await transactionService.createTransactionsByRentId(
      req.body
    );

    if (respData?.success) {
      res.status(200).json({
        status: "success",
        data: respData.data,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Transaction was not created. Validation Error",
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Transactions Service internal Error ${e}`,
    });
  }
};
