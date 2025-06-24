import { AppDataSource } from "../database/data-source";
import { Property } from "../entity/property.entity";

const properyRepository = AppDataSource.getRepository(Property);

//

export const getPropertiesByUserId = async (userId: string) => {
  const respData = await properyRepository.find({ where: { userId } });
  return respData;
};

export const getPropertyById = async (id: number) => {
  return await properyRepository.find({
    where: { id },
  });
};
