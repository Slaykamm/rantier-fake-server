import { AppDataSource } from "../database/data-source";
import { Rent } from "../entity/rent.entity";

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

  return filteredResult;
};
