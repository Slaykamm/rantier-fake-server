import { Counter } from "../entity/counter.entity";

export interface ICounterCreateDto
  extends Omit<
    Counter,
    | "id"
    | "counterType"
    | "counterTypeId"
    | "propertyId"
    | "type"
    | "indications"
    | "isActive"
    | "property"
  > {
  counterType: string;
  counterValue?: number;
  propertyId?: number;
}
