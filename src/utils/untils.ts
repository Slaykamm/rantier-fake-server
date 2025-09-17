// function isStringNumber(str: string) {
//   return !isNaN(parseFloat(str)) && isFinite(str);
// }

import { Transactions } from "../entity/transactions.entity";
import { ICounterCreateDto } from "../models/counter.model";

function isNumber(value: number) {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

export const getSumFromTransaction = (array: Transactions[]): number => {
  // @ts-ignore
  const sum: number = array?.reduce((acc, item) => {
    if (isNumber(item.amount)) {
      return (acc += item.amount);
    }
  }, 0 as number);
  return sum;
};

export const getTgUsername = (tgUsername?: string) => {
  if (!tgUsername) {
    return "";
  }
  if (tgUsername[0] === "@") {
    return tgUsername;
  }
  return "@" + tgUsername;
};

export function parseCounters(
  countersData?: string | ICounterCreateDto[],
  isImage?: boolean
): ICounterCreateDto[] {
  if (!countersData) {
    return [];
  }
  if (!isImage && Array.isArray(countersData)) {
    return countersData as ICounterCreateDto[];
  }

  return JSON.parse(countersData as string) as unknown as ICounterCreateDto[];
}
