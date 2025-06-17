import { AppDataSource } from "../database/data-source";
import { Property } from "../entity/property.entity";

const properyRepository = AppDataSource.getRepository(Property);

//

export const getProperties = async () => {
  const respData = await properyRepository.find();
  return respData;
};

export const getPropertyById = async (id: number) => {
  return await properyRepository.find({
    where: { id },
  });
};
