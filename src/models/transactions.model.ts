import { Rent } from "../entity/rent.entity";

export interface ITransactions {
  id: number;
  createAt: string;
  rentId: Rent;
  amount: number;
  kindOfPayment: string;
  type: string;
}

export interface ITransactionsBalanceResponseDto {
  mainTotal: number;
  serviceTotal: number;
  total: number;
}

export interface ITransactionCreateDto {
  rentId: number;
  amount: number;
  kindOfPayment: string;
  type: string;
}
