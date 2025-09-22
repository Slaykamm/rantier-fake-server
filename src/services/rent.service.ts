import { AppDataSource } from "../database/data-source";
import { Property } from "../entity/property.entity";
import { Rent } from "../entity/rent.entity";
import { Tenant } from "../entity/tenant.entity";
import { User } from "../entity/user.entity";
import { IRentCreateDto } from "../models/rent.model";

const rentRepository = AppDataSource.getRepository(Rent);

//

export const getRents = async () => {
  const respData = await rentRepository.find({
    relations: ["property"],
  });
  return respData;
};

export const getRentById = async (id: number) => {
  const respData = await rentRepository.find({
    where: { id },
    relations: ["property"],
  });
  return respData;
};

export const getRentByPropertyId = async (propertyId: number) => {
  const rentsResult = await rentRepository.find({
    where: { propertyId, isActiveRent: true },
    relations: ["property"],
  });

  const filteredResult = rentsResult.filter(
    (rent) => new Date() <= new Date(rent.endContractDate)
  );

  const orderedResult = filteredResult.sort(
    (a, b) => +new Date(b.createAt) - +new Date(a.createAt)
  );

  return orderedResult[0];
};

export const createRentByProperyIdAction = async (
  props: IRentCreateDto
): Promise<{ success: boolean; message?: string; data?: Rent[] }> => {
  try {
    const {
      contractNumber,
      propertyId,
      rentAmount,
      contractDate,
      contractExpiryDate,
      contractScanPath,
      counterValuesRequestDate,
      paymentDate,
      tenants,
    } = props;

    let newRent: Rent | null;
    await AppDataSource.manager.transaction(async (transactionManager) => {
      const rentRepository = transactionManager.getRepository(Rent);

      const today = new Date().toISOString();

      newRent = rentRepository.create({
        createAt: today,
        contract: contractNumber,
        amount: rentAmount,
        contractDate,
        endContractDate: contractExpiryDate,
        isActiveRent: true,
        paymentDate,
        propertyId,
        requestIndicatorsDate: counterValuesRequestDate,
      });

      await rentRepository.save(newRent);

      let newTenants; //: Tenant[] | null
      if (tenants?.length && !!newRent) {
        const tenantRepository = transactionManager.getRepository(Tenant);

        tenants.forEach(async (tenant) => {
          const {
            firstName,
            isPrimary,
            lastName,
            phone,
            email,
            passportDate,
            passportIssued,
            passportNumber,
            passportSeries,
            tgId,
            tgUsername,
          } = tenant;
          const newTenant = tenantRepository.create({
            firstName,
            lastName,
            tenantType: isPrimary ? 1 : 2,
            phone,
            email,
            tgId,
            tgNick: tgUsername,
            passportSeries,
            passportNumber,
            passportIssued,
            passportDate,
            // secondName: "",
            rentId: newRent?.id,
          });

          await tenantRepository.save(newTenant);
        });
      }

      const propertyRepository = transactionManager.getRepository(Property);
      await propertyRepository.update(propertyId, {
        isRented: true,
      });
    });
    return { success: true, data: [newRent!] };
  } catch (e) {
    return {
      success: false,
      message: `Error while creating rent ${e}`,
    };
  }
};

export const finishRentByProperyIdAction = async (propertyId: number) => {
  try {
    const result = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        // 1. Находим самую свежую активную аренду
        const mostRecentActiveRent = await transactionalEntityManager
          .createQueryBuilder(Rent, "rent")
          .leftJoinAndSelect("rent.property", "property")
          .where("rent.propertyId = :propertyId", { propertyId })
          .andWhere("rent.isActiveRent = :isActiveRent", { isActiveRent: true })
          .andWhere("rent.endContractDate >= :currentDate", {
            currentDate: new Date(),
          })
          .orderBy("rent.createAt", "DESC")
          .getOne();

        // 2. Если запись найдена, обновляем её isActiveRent на false
        if (mostRecentActiveRent) {
          await transactionalEntityManager
            .createQueryBuilder()
            .update(Rent)
            .set({ isActiveRent: false })
            .where("id = :id", { id: mostRecentActiveRent.id })
            .execute();
        }

        return mostRecentActiveRent; // Возвращаем запись, которую деактивировали
      }
    );

    return {
      success: true,
      data: result,
    };
  } catch (e) {
    return {
      success: false,
      message: `Error while ending rent ${e}`,
    };
  }
};

export const findRentByProperyIdAction = async (propertyId: number) => {
  try {
    const mostRecentActiveRent = await AppDataSource.getRepository(Rent)
      .createQueryBuilder("rent")
      .leftJoinAndSelect("rent.property", "property")
      .where("rent.propertyId = :propertyId", { propertyId })
      .andWhere("rent.isActiveRent = :isActiveRent", { isActiveRent: true })
      .andWhere("rent.endContractDate >= :currentDate", {
        currentDate: new Date(),
      })
      .orderBy("rent.createAt", "DESC")
      .getOne();

    return {
      success: true,
      data: mostRecentActiveRent,
    };
  } catch (e) {
    return {
      success: false,
      message: `Error while ending rent ${e}`,
    };
  }
};

export const expiredContracts = async (days: number = 5) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split("T")[0];

  const targetDate = new Date();
  targetDate.setDate(today.getDate() + days);
  const targetDateString = targetDate.toISOString().split("T")[0];

  try {
    // Сначала получаем базовые данные
    const expiredContracts = await rentRepository
      .createQueryBuilder("rent")
      .leftJoinAndSelect("rent.property", "property")
      .where("date(rent.endContractDate) BETWEEN :startDate AND :endDate", {
        startDate: todayString,
        endDate: targetDateString,
      })
      .andWhere("rent.isActiveRent = :isActive", { isActive: true })
      .orderBy("rent.endContractDate", "ASC")
      .getMany();

    // Затем для каждого контракта получаем user и devices отдельно
    const enrichedContracts = await Promise.all(
      expiredContracts.map(async (rent) => {
        if (rent.property?.userId) {
          const userRepository = AppDataSource.getRepository(User);
          const user = await userRepository.findOne({
            where: { id: rent.property.userId },
            relations: ["devices"],
          });

          if (user) {
            rent.property.user = user;
          }
        }
        return rent;
      })
    );

    return enrichedContracts;
  } catch (error) {
    console.error("Error in expiredContracts:", error);
    throw error;
  }
};

export const invoicingContacts = async (days: number = 3) => {
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + days);

  // Форматируем день с ведущим нулем
  const targetDay = targetDate.getDate().toString().padStart(2, "0");

  try {
    const expiredContracts = await rentRepository
      .createQueryBuilder("rent")
      .leftJoinAndSelect("rent.property", "property")
      .leftJoinAndSelect("property.user", "user")
      .leftJoinAndSelect("user.devices", "devices")
      .where("rent.requestIndicatorsDate LIKE :pattern", {
        pattern: `%-${targetDay}`,
      })
      .andWhere("rent.isActiveRent = :isActive", { isActive: true })
      .orderBy("rent.endContractDate", "ASC")
      .getMany();

    return expiredContracts;
  } catch (error) {
    console.error("Error in expiredContracts:", error);
    throw error;
  }
};

export const getActiveRents = async () => {
  try {
    const activeRents = await rentRepository.find({
      where: { isActiveRent: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUtc = today.getTime();

    const contractsToClose = activeRents.filter(
      (contract) => new Date(contract.endContractDate).getTime() < todayUtc
    );

    activeRents.forEach(async (item) => {
      if (new Date(item.endContractDate).getTime() < todayUtc) {
        item.isActiveRent = false;
      }
    });
    await rentRepository.save(activeRents);

    return contractsToClose;
  } catch (e) {
    console.log(`Ошибка поиска ${e}`);
  }
};
