import { AppDataSource } from "../database/data-source";
import { Counter } from "../entity/counter.entity";

const counterRepository = AppDataSource.getRepository(Counter);
// .find({relations: ['counterType']});

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
