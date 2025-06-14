// function isStringNumber(str: string) {
//   return !isNaN(parseFloat(str)) && isFinite(str);
// }

import { ITransactions } from "../models/transactions.model";

function isNumber(value: number) {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

export const getSumFromTransaction = (array: ITransactions[]): number => {
  // @ts-ignore
  const sum: number = array?.reduce((acc, item) => {
    if (isNumber(item.amount)) {
      return (acc += item.amount);
    }
  }, 0 as number);
  return sum;
};
