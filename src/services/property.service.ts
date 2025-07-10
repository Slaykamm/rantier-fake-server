import { AppDataSource } from "../database/data-source";
import { Counter } from "../entity/counter.entity";
import { CounterType } from "../entity/counterType.entity";
import { Indications } from "../entity/indications.entity";
import { Property } from "../entity/property.entity";
import { User } from "../entity/user.entity";
import { IPropertyCreateDto } from "../models/property.model";
import { findRentByProperyIdAction } from "./rent.service";
import { getUserByUserId } from "./user.service";

const properyRepository = AppDataSource.getRepository(Property);

//

export const getPropertiesByUserId = async (userId: string) => {
  const user = await getUserByUserId(userId);
  if (user) {
    const respData = await properyRepository.find({
      where: { userId: user.id },
    });

    const enrichedProperties: Property[] = [];

    for (const property of respData) {
      const result = await findRentByProperyIdAction(property.id);
      enrichedProperties.push({
        ...property,
        isRented: !!result.data?.isActiveRent,
      });
    }

    return enrichedProperties;
  }
};

export const getPropertyById = async (id: number) => {
  return await properyRepository.find({
    where: { id },
  });
};

interface ICreateActionPorps extends IPropertyCreateDto {
  userEmail?: string;
}

export const createPropertyAction = async (props: ICreateActionPorps) => {
  const { userEmail, name, address, rooms, area, label, counters } = props;

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
        });

        await propertyRepository.save(newProperty);
      }
    );

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

        counters?.forEach(async (counter) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Обнуляем часы, минуты, секунды, миллисекунды
          const verificationDate = new Date(counter.verificationDate);
          const nextVerificationDate = new Date(counter.nextVerificationDate);

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
    );

    return {
      success: true,
      // data: JSON.parse(JSON.stringify(newProperty)),
    };
  } catch (e) {
    // console.log("TEST e", e);
    return {
      success: false,
      message: `Error while creating property ${e}`,
    };
  }
};
