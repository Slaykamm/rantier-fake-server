import { AppDataSource } from "../database/data-source";
import { Transactions } from "../entity/transactions.entity";
import {
  ITransactionCreateDto,
  ITransactions,
  ITransactionsBalanceResponseDto,
} from "../models/transactions.model";
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
): Promise<ITransactionsBalanceResponseDto> => {
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

export const getTransactionsHistoryByRentId = async (
  rentId: number
): Promise<Transactions[]> => {
  const filteredByRentId = await transactionRepository.find({
    where: { rentId },
  });
  return (filteredByRentId || []).sort(
    (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
  );
};

export const deleteTransactionById = async (id: number) => {
  try {
    const transaction = await transactionRepository.delete({ id });
    if (!transaction) {
      return { success: false };
    }

    return { success: true };
  } catch (e) {
    if (e instanceof Error) return { success: false, message: e.message };
  }
};

export const createTransactionsByRentId = async (
  req: ITransactionCreateDto
) => {
  const { amount, rentId, kindOfPayment, type } = req;
  if (!amount || !rentId || !kindOfPayment || !type) {
    return { success: false };
  }
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Обнуляем часы, минуты, секунды, миллисекунды

    const newTransaction = transactionRepository.create({
      createAt: today.toISOString().split("T")[0],
      rentId,
      amount,
      kindOfPayment,
      type,
    });
    await transactionRepository.save(newTransaction);
    return { success: true, data: [newTransaction] };
  } catch (e) {
    if (e instanceof Error) return { success: false, message: e.message };
  }
};
