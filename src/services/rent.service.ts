import { AppDataSource } from "../database/data-source";
import { Property } from "../entity/property.entity";
import { Rent } from "../entity/rent.entity";
import { Tenant } from "../entity/tenant.entity";
import { IRentCreateDto } from "../models/rent.model";

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

  const orderedResult = filteredResult.sort(
    (a, b) => +new Date(b.createAt) - +new Date(a.createAt)
  );

  return orderedResult[0];
};

export const createRentByProperyIdAction = async (props: IRentCreateDto) => {
  try {
    const {
      contractNumber,
      propertyId,
      rentAmount,
      contractDate,
      contractExpiryDate,
      contractScanPath,
      counterValuesRequestDate,
      paymentDate,
      tenants,
    } = props;
    await AppDataSource.manager.transaction(async (transactionManager) => {
      const rentRepository = transactionManager.getRepository(Rent);

      let newRent: Rent | null;
      const today = new Date().toISOString();

      newRent = rentRepository.create({
        createAt: today,
        contract: contractNumber,
        amount: rentAmount,
        contractDate,
        endContractDate: contractExpiryDate,
        isActiveRent: true,
        paymentDate,
        propertyId,
        requestIndicatorsDate: counterValuesRequestDate,
      });

      await rentRepository.save(newRent);

      let newTenants; //: Tenant[] | null
      if (tenants?.length) {
        const tenantRepository = transactionManager.getRepository(Tenant);

        tenants.forEach(async (tenant) => {
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
          } = tenant;
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
            // secondName: "",
            rentId: newRent.id,
          });

          await tenantRepository.save(newTenant);
        });
      }

      const propertyRepository = transactionManager.getRepository(Property);
      await propertyRepository.update(propertyId, {
        isRented: true,
      });

      return { success: true };
    });
  } catch (e) {
    return {
      success: false,
      message: `Error while creating rent ${e}`,
    };
  }
};
