import { AppDataSource } from "../database/data-source";
import { Rent } from "../entity/rent.entity";
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

export const getAutoInvoiingContractsByUserId = async ({
  days,
  userId,
}: {
  days: number;
  userId: number;
}) => {
  // отобрать все счета по данному пользователю userId
  // за days дней мне надо отобрать контракты у которых черех days дней будет день оплаты.
  // у этих контрактов мне надо во первых отобрать такие, у которых за тот же месяц что и будущая оплата отсутствует счет с датой создания этого же месяца и типом счета(kindOfPayment ) = main
  // после этого надо добавить такой счет с фактической датой создания

  // После этого надо еще раз получить все транзакции всю историю по данному rentId
  // После этого вернуть из функции текст: По договору аренды №rentId счет за (месяц актуальной оплаты) сумма составит: (сумма из выше полученных транзакций с типом (type) счетов(invoice) минус полученные оплаты с типом payment )
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + days);

  // Очищаем время для точного сравнения дат
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  // Форматируем день с ведущим нулем
  const targetDay = targetDate.getDate().toString().padStart(2, "0");
  try {
    const rentRepository = AppDataSource.getRepository(Rent);
    // 1. Находим контракты с наступающей датой оплаты
    const upcomingContracts = await rentRepository
      .createQueryBuilder("rent")
      .leftJoinAndSelect("rent.property", "property")
      .leftJoinAndSelect("property.user", "user")
      .leftJoinAndSelect("user.devices", "devices")
      .where("rent.paymentDate  LIKE :pattern", {
        pattern: `%-${targetDay}`,
      })
      .andWhere("rent.isActiveRent = :isActive", { isActive: true })
      .andWhere("property.userId = :userId", { userId })
      .getMany();

    const results = [];
    for (const contract of upcomingContracts) {
      // 2. Определяем месяц будущей оплаты
      const paymentMonth = targetDate.getMonth() + 1; // +1 потому что месяцы с 0 до 11
      const paymentYear = targetDate.getFullYear();

      const targetMonthYear = `${paymentYear}-${paymentMonth
        .toString()
        .padStart(2, "0")}`;

      // 3. Проверяем отсутствие счета за этот же месяц с типом 'main'
      const existingInvoice = await transactionRepository
        .createQueryBuilder("transactions")
        .where("transactions.rentId = :rentId", { rentId: contract.id })
        .andWhere("transactions.createAt LIKE :pattern", {
          pattern: `${targetMonthYear}%`,
        })
        .andWhere("transactions.kindOfPayment = :kind", { kind: "main" })
        .getOne();

      // Если счет уже существует, пропускаем

      if (!existingInvoice) {
        // 4. Создаем новый счет
        const newInvoice = transactionRepository.create({
          rentId: contract.id,
          kindOfPayment: "main",
          createAt: today.toISOString().split("T")[0],
          amount: contract.amount,
          type: "invoice",
          // другие необходимые поля для счета
        });
        await transactionRepository.save(newInvoice);
      }
      // 5. Получаем всю историю транзакций по rentId
      const transactions = await transactionRepository
        .createQueryBuilder("transaction")
        .where("transaction.rentId = :rentId", { rentId: contract.id })
        .getMany();

      // 6. Рассчитываем сумму: invoice - payment
      let invoiceSum = 0;
      let paymentSum = 0;

      transactions.forEach((transaction) => {
        if (transaction.type === "invoice") {
          invoiceSum += transaction.amount || 0;
        } else if (transaction.type === "payment") {
          paymentSum += transaction.amount || 0;
        }
      });

      const totalAmount = invoiceSum - paymentSum;

      // 7. Формируем текст результата
      const monthNames = [
        "январь",
        "февраль",
        "март",
        "апрель",
        "май",
        "июнь",
        "июль",
        "август",
        "сентябрь",
        "октябрь",
        "ноябрь",
        "декабрь",
      ];
      const monthName = monthNames[paymentMonth - 1];

      const resultText = `По договору аренды №${contract.contract} счет за ${monthName} ${paymentYear} сумма составит: ${totalAmount} руб.`;

      results.push({
        rentId: contract.id,
        invoiceId: 2, // newInvoice.id,
        amount: totalAmount,
        message: resultText,
        contract,
      });
    }

    return results as {
      rentId: number;
      invoiceId: number;
      amount: number;
      message: string;
      contract: Rent;
    }[];
  } catch (error) {
    console.error("Error in generateUpcomingInvoices:", error);
    throw error;
  }
};
