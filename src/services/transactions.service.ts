import { AppDataSource } from "../database/data-source";
import { Transactions } from "../entity/transactions.entity";
import { ITransactionsResponseDto } from "../models/transactions.model";
import { getSumFromTransaction } from "../utils/untils";

const transactionRepository = AppDataSource.getRepository(Transactions);

export const getTransactions = async () => {
  const respData = await transactionRepository.find({
    relations: ["rent"],
  });
  return respData;
};

export const getTransactionsByRentId = async (
  rentId: number
): Promise<ITransactionsResponseDto> => {
  const filteredByRentId = await transactionRepository.find({
    where: { rentId },
    relations: ["rent"],
  });

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

  return { mainTotal, serviceTotal, total };
};
