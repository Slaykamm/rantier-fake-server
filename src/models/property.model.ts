import { Counter } from "../entity/counter.entity";
import { Property } from "../entity/property.entity";
import { ICounterCreateDto } from "./counter.model";

export interface IPropertyCreateDto
  extends Omit<
    Property,
    "id" | "userId" | "isRented" | "rent" | "user" | "counters"
  > {
  counters: ICounterCreateDto[];
}
