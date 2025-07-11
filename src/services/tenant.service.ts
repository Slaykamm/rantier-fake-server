import { AppDataSource } from "../database/data-source";
import { Tenant } from "../entity/tenant.entity";
import { ISecondaryTenantCreateDto } from "../models/tenant.model";
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

export const createTenantAction = async (props: ISecondaryTenantCreateDto) => {
  const {
    firstName,
    isPrimary,
    lastName,
    phone,
    email,
    passportDate,
    passportIssued,
    passportNumber,
    passportSeries,
    tgId,
    tgUsername,
    rentId,
  } = props;

  try {
    await AppDataSource.manager.transaction(async (transactionManager) => {
      const tenantRepository = transactionManager.getRepository(Tenant);
      const newTenant = tenantRepository.create({
        firstName,
        lastName,
        tenantType: isPrimary ? 1 : 2,
        phone,
        email,
        tgId,
        tgNick: tgUsername,
        passportSeries,
        passportNumber,
        passportIssued,
        passportDate,
        rentId,
      });

      await tenantRepository.save(newTenant);
    });
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
