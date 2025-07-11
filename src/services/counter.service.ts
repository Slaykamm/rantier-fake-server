import { AppDataSource } from "../database/data-source";
import { Counter } from "../entity/counter.entity";
import { CounterType } from "../entity/counterType.entity";
import { Indications } from "../entity/indications.entity";
import { Property } from "../entity/property.entity";
import { ICounterCreateDto } from "../models/counter.model";

const counterRepository = AppDataSource.getRepository(Counter);

export const getCounters = async () => {
  const respData = await counterRepository.find({ relations: ["counterType"] });
  return respData;
};

export const getCounterById = async (id: number) => {
  return await counterRepository.find({
    where: { id },
    relations: ["counterType"],
  });
};

export const getCountersByPropertyId = async (propertyId: number) => {
  return await counterRepository.find({
    where: { propertyId },
    relations: ["counterType"],
  });
};

export const createCounterAction = async (props: ICounterCreateDto) => {
  try {
    const {
      counterId,
      counterType,
      nextVerificationDate,
      verificationDate,
      counterValue,
      propertyId,
    } = props;

    if (!propertyId || !counterType || !counterId) {
      return {
        success: false,
        message: "PropertyId or CounterType or counterId absent!",
      };
    }

    const result = await AppDataSource.transaction(
      async (transactionalManager) => {
        const counterTypeRepo = transactionalManager.getRepository(CounterType);
        const counterRepo = transactionalManager.getRepository(Counter);
        const indicationsRepository =
          transactionalManager.getRepository(Indications);

        const counterTyp = await counterTypeRepo.findOneBy({
          type: counterType,
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Обнуляем часы, минуты, секунды, миллисекунды
        const verificationDateCalc = new Date(verificationDate);
        const nextVerificationDateCalc = new Date(nextVerificationDate);

        const isCounterActive = !!(
          verificationDateCalc <= today && nextVerificationDateCalc >= today
        );

        const newCounter = counterRepo.create({
          counterTypeId: counterTyp?.id,
          counterId,
          verificationDate,
          nextVerificationDate,
          propertyId,
          isActive: isCounterActive,
        });
        await counterRepository.save(newCounter);

        const newIndication = indicationsRepository.create({
          counterId: newCounter.id,
          createAt: today.toString(),
          value: counterValue,
        });
        await indicationsRepository.save(newIndication);
      }
    );

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      message: `Error while ending rent ${e}`,
    };
  }
};
export const deleteCounterAction = async (counterId: number) => {
  try {
    if (!counterId) {
      return {
        success: false,
        message: "counterId absent!",
      };
    }

    const result = await AppDataSource.transaction(
      async (transactionalManager) => {
        const counterRepo = transactionalManager.getRepository(Counter);
        const indicationsRepository =
          transactionalManager.getRepository(Indications);

        // 1. Удаляем все показания, связанные с этим счетчиком
        await indicationsRepository.delete({
          counterId,
        });

        // 2. Удаляем сам счетчик
        const deleteResult = await counterRepo.delete({ id: counterId });

        if (deleteResult.affected === 0) {
          throw new Error("Counter not found");
        }

        return { success: true };
      }
    );

    return {
      success: true,
      message: "Counter and all its indications deleted successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: `Error while deleting counter`,
    };
  }
};
