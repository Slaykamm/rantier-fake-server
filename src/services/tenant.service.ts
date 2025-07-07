import { AppDataSource } from "../database/data-source";
import { Tenant } from "../entity/tenant.entity";
import { getRentByPropertyId } from "./rent.service";

const tenantRepository = AppDataSource.getRepository(Tenant);

export const getTenants = async () => {
  const respData = await tenantRepository.find({
    relations: ["rent"],
  });
  return respData;
};

export const getTenantById = async (id: number) => {
  const respData = await tenantRepository.find({
    where: { id },
    relations: ["rent"],
  });
  return respData;
};

export const getTenantsByPropertyId = async (propertyId: number) => {
  const rent = await getRentByPropertyId(propertyId);

  if (!rent) {
    return [];
  }

  const rentsResult = await tenantRepository.find({
    where: { rentId: rent.id },
    relations: ["rent"],
  });

  return rentsResult;
};
