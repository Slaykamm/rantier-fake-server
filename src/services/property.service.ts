import { AppDataSource } from "../database/data-source";
import { Property } from "../entity/property.entity";
import { getUserByUserId } from "./user.service";

const properyRepository = AppDataSource.getRepository(Property);

//

export const getPropertiesByUserId = async (userId: string) => {
  const user = await getUserByUserId(userId);
  if (user) {
    const respData = await properyRepository.find({
      where: { userId: user.id },
    });
    return respData;
  }
};

export const getPropertyById = async (id: number) => {
  return await properyRepository.find({
    where: { id },
  });
};
