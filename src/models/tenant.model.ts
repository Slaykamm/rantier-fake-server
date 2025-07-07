export interface ITenantCreateDto {
  firstName: string;
  lastName: string;
  isPrimary: boolean;
  phone: string;
  email?: string;
  tgId?: number;
  tgUsername?: string;
  passportSeries?: string;
  passportNumber?: string;
  passportDate?: string;
  passportIssued?: string;
}
