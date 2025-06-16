import { IRent } from "./rent.model";

export interface ITenant {
  id: number;
  firstName: string;
  secondName: string;
  lastName: string;
  tenantType: number;
  phone: string;
  email: string;
  tgId?: number;
  tgNick?: string;
  passportSeries?: string;
  passportNumber?: string;
  passportDate?: string;
  passportIssued?: string;
  rentId: IRent;
}
