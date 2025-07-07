import { ITenantCreateDto } from "./tenant.model";

export interface IRentCreateDto {
  propertyId: number;
  contractNumber: string;
  contractDate?: string;
  contractExpiryDate?: string;
  counterValuesRequestDate?: string;
  paymentDate?: string;
  rentAmount: number;
  contractScanPath?: string;
  tenants?: ITenantCreateDto[];
}
