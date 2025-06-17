import { AppDataSource } from "../database/data-source";
import { Tenant } from "../entity/tenant.entity";

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

export const getTenantsByRentId = async (rentId: number) => {
  const rentsResult = await tenantRepository.find({
    where: { rentId },
    relations: ["rent"],
  });

  return rentsResult;
};
