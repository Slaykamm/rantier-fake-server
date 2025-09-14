import { AppDataSource } from "../database/data-source";
import { Counter } from "../entity/counter.entity";
import { CounterType } from "../entity/counterType.entity";
import { Indications } from "../entity/indications.entity";
import { Property } from "../entity/property.entity";
import { User } from "../entity/user.entity";
import { IPropertyCreateDto } from "../models/property.model";
import { findRentByProperyIdAction } from "./rent.service";
import { getUserByUserId } from "./user.service";
import path from "path";
import fs from "fs";
import { parseCounters } from "../utils/untils";
import { Rent } from "../entity/rent.entity";
import { Tenant } from "../entity/tenant.entity";
import { Transactions } from "../entity/transactions.entity";

const properyRepository = AppDataSource.getRepository(Property);

//

export const getPropertiesByUserId = async (userId: string) => {
  const user = await getUserByUserId(userId);
  if (user) {
    const respData = await properyRepository.find({
      where: { userId: user.id },
    });

    const enrichedProperties: Property[] = [];

    // function getIsRent({
    //   data,
    //   propertyId,
    // }: {
    //   data?: Rent | null | undefined;
    //   propertyId: number;
    // }) {

    //   const isActualValue = data?.find(rent => rent.)

    // }

    for (const property of respData) {
      const result = await findRentByProperyIdAction(property.id);
      console.log("test1111", result);
      enrichedProperties.push({
        ...property,
        isRented: !!result.data?.isActiveRent,
      });
    }

    console.log("test enrichedProperties", enrichedProperties);
    return enrichedProperties;
  }
};

export const getPropertyById = async (id: number) => {
  const property = await properyRepository.findOne({
    where: { id },
  });
  const activeRent = await findRentByProperyIdAction(id);

  if (!property) {
    return { sucess: false, message: "Не найдено Объекта недвижимости" };
  }
  property.isRented = !!activeRent.data?.isActiveRent;

  return { success: true, data: property };
};

// Возвращает массив запросов, которые должны все выполнится иначе будет ошибка.
async function asyncMapParallel<T, U>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<U>
): Promise<U[]> {
  const promises = array.map((item, index) => callback(item, index, array));
  return Promise.all(promises);
}

export const deletePropertyById = async (
  id: number
): Promise<{ success: boolean; message?: string } | undefined> => {
  try {
    await AppDataSource.manager.transaction(async (transManager) => {
      // если аренда активна - ничего не делаем. возвращаем ошибку
      const result = await findRentByProperyIdAction(id);
      if (!!result.data) {
        throw Error("Аренда активна. Необходимо завершить ее до удаления ОН.");
      }

      const counterManager = transManager.getRepository(Counter);
      const indicationsManager = transManager.getRepository(Indications);

      // находим счетчики. и по каждому счетчику сначала удаляем показания. потом и их.
      const propertyCounters = await counterManager.find({
        where: { propertyId: id },
      });
      const counterIds = propertyCounters?.map((counter) => counter.id);
      if (counterIds?.length) {
        await asyncMapParallel(counterIds, async (num) => {
          const indicationsByCounterId = await indicationsManager.find({
            where: { counterId: num },
          });
          const indicationIds = indicationsByCounterId?.map(
            (indication) => indication.id
          );
          if (!!indicationIds?.length) {
            await indicationsManager
              .createQueryBuilder()
              .delete()
              .where("id IN (:...indicationIds)", { indicationIds })
              .execute();
          }
          await counterManager.delete({ id: num });
        });
      }
      // тоже самое аренда => арендодатель
      const rentManager = transManager.getRepository(Rent);
      const tenantManager = transManager.getRepository(Tenant);
      const transactionManager = transManager.getRepository(Transactions);

      const propertyRents = await rentManager.find({
        where: { propertyId: id },
      });

      const rentIds = propertyRents?.map((rent) => rent.id);

      if (rentIds?.length) {
        asyncMapParallel(rentIds, async (rentId) => {
          const tenantsByRentId = await tenantManager.find({
            where: { rentId },
          });
          const tenantIds = tenantsByRentId?.map((tenant) => tenant.id);
          if (!!tenantIds?.length) {
            await tenantManager
              .createQueryBuilder()
              .delete()
              .where("id IN (:...tenantIds)", { tenantIds })
              .execute();
          }

          const transactionByRentId = await transactionManager.find({
            where: { rentId },
          });

          const transactionIds = transactionByRentId?.map(
            (transaction) => transaction.id
          );
          if (!!transactionIds?.length) {
            await transactionManager
              .createQueryBuilder()
              .delete()
              .where("id IN (:...transactionIds)", { transactionIds })
              .execute();
          }

          await rentManager.delete({ id: rentId });
        });
      }
      const propertyManager = transManager.getRepository(Property);
      await propertyManager.delete({ id });
    });
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, message: e.message };
    }
    return { success: false, message: "Unknown error occurred" };
  }
};

interface ICreateActionPorps extends IPropertyCreateDto {
  userEmail?: string;
  imagePath?: string;
}

export const createPropertyAction = async (
  props: ICreateActionPorps
): Promise<
  | {
      success: boolean;
      message?: string;
      data?: Property;
    }
  | undefined
> => {
  const { userEmail, name, address, rooms, area, label, counters, imagePath } =
    props;

  const userRepository = AppDataSource.getRepository(User);
  try {
    const presentUser = await userRepository.findOneBy({ userId: userEmail });
    if (!presentUser) {
      return {
        success: false,
        message: "No user found!",
      };
    }

    let newProperty: Property | null;
    await AppDataSource.manager.transaction(
      async (transactionPropertyManager) => {
        const propertyRepository =
          transactionPropertyManager.getRepository(Property);
        newProperty = propertyRepository.create({
          name: name?.toString(),
          address: address?.toString(),
          area,
          isRented: false,
          label,
          rooms,
          userId: presentUser.id,
          image: imagePath,
        });

        await propertyRepository.save(newProperty);

        await AppDataSource.manager.transaction(
          async (transactionCountersManager) => {
            if (!newProperty) {
              return {
                success: false,
                message: "Something went wrong with property creation!",
              };
            }
            const counterRepository =
              transactionCountersManager.getRepository(Counter);
            const counterTypeRepository =
              transactionCountersManager.getRepository(CounterType);
            const indicationsRepository =
              transactionCountersManager.getRepository(Indications);

            if (!!counters?.length) {
              parseCounters(counters as any)?.forEach(async (counter) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Обнуляем часы, минуты, секунды, миллисекунды
                const verificationDate = new Date(counter.verificationDate);
                const nextVerificationDate = new Date(
                  counter.nextVerificationDate
                );

                const isCounterActive = !!(
                  verificationDate <= today && nextVerificationDate >= today
                );

                const counterByType = await counterTypeRepository.findOneBy({
                  type: counter.counterType,
                });

                const newCounter = counterRepository.create({
                  counterTypeId: counterByType?.id,
                  counterId: counter.counterId,
                  verificationDate: counter.verificationDate,
                  nextVerificationDate: counter.nextVerificationDate,
                  propertyId: newProperty!.id,
                  isActive: isCounterActive,
                });
                await counterRepository.save(newCounter);

                const newIndication = indicationsRepository.create({
                  counterId: newCounter.id,
                  createAt: today.toString(),
                  value: counter.counterValue,
                });
                await indicationsRepository.save(newIndication);
              });
            }
          }
        );
        return {
          success: true,
          data: JSON.parse(JSON.stringify(newProperty)),
        };
      }
    );
  } catch (e) {
    // console.log("TEST e", e);
    return {
      success: false,
      message: `Error while creating property ${e}`,
    };
  }
};

export const updatePropertyImage = async ({
  propertyId,
  imagePath,
}: {
  propertyId?: number;
  imagePath: string;
}) => {
  try {
    if (!propertyId) {
      return {
        success: false,
        message: "PropertyId absent",
      };
    }
    const propertyData = await properyRepository.findOneBy({ id: propertyId });
    if (!propertyData) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Delete old avatar if exists
    if (propertyData.image && fs.existsSync(propertyData.image)) {
      fs.unlinkSync(propertyData.image);
    }

    return {
      success: true,
      data: {
        imageUrl: `/uploads/${path.basename(imagePath)}`,
      },
    };
  } catch (e) {
    // console.log("TEST e", e);
    return {
      success: false,
      message: `Error while creating user ${e}`,
    };
  }
};
