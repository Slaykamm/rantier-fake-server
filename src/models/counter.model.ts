import { CounterType } from "../entity/counterType.entity";
import { ICounterType } from "./counterType.model";
import { IProperty } from "./property.model";

export interface ICounter {
  id: number;
  counterTypeId: ICounterType;
  counterId: string;
  verificationDate: string;
  nextVerificationDate: string;
  propertyId: IProperty;
  isActive: boolean;
}
