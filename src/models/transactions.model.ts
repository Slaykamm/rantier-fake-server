import { Rent } from "../entity/rent.entity";

export interface ITransactions {
  id: number;
  createAt: string;
  rentId: Rent;
  amount: number;
  kindOfPayment: string;
  type: string;
}

export interface ITransactionsResponseDto {
  mainTotal: number;
  serviceTotal: number;
  total: number;
}
