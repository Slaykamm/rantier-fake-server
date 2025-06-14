import { Request, Response } from "express";
import { IResponseDto } from "../models/response.model";
import {
  ITransactions,
  ITransactionsResponseDto,
} from "../models/transactions.model";
import { getSumFromTransaction } from "../utils/untils";

const transactions: ITransactions[] = require("../../mocks/tenant.json");

export const getTransactionsByRentId = (
  req: Request<{}, {}, { rentId: number }>,
  res: Response<IResponseDto<ITransactionsResponseDto>>
) => {
  const rentId = req.body.rentId;

  try {
    const filteredByRentId = transactions?.filter(
      (transaction) => transaction.rentId == rentId
    );

    const main = filteredByRentId.filter(
      (invoice: any) => invoice.kindOfPayment == "main"
    );
    const mainInvoices = main.filter((invoice) => invoice.type == "invoice");
    const mainPayments = main.filter((invoice) => invoice.type == "payment");

    const service = filteredByRentId.filter(
      (invoice) => invoice.kindOfPayment == "service"
    );
    const serviceInvoices = service.filter(
      (invoice) => invoice.type == "invoice"
    );
    const servicePayments = service.filter(
      (invoice) => invoice.type == "payment"
    );

    const mainInvoiceSum = getSumFromTransaction(mainInvoices);
    const mainPaymentsSum = getSumFromTransaction(mainPayments);

    const serviceInvoicesSum = getSumFromTransaction(serviceInvoices);
    const servicePaymentsSum = getSumFromTransaction(servicePayments);

    const mainTotal = mainInvoiceSum - mainPaymentsSum;
    const serviceTotal = serviceInvoicesSum - servicePaymentsSum;
    const total = mainTotal + serviceTotal;

    res.status(200).json({
      status: "success",
      data: [{ mainTotal, serviceTotal, total }],
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Transactions Service internal Error ${e}`,
    });
  }
};
