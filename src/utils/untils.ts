// function isStringNumber(str: string) {
//   return !isNaN(parseFloat(str)) && isFinite(str);
// }

import { Transactions } from "../entity/transactions.entity";

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
