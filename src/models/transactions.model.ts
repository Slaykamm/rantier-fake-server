import { IRent } from "./rent.model";

export interface ITransactions {
  id: number;
  createAt: string;
  rentId: IRent;
  amount: number;
  kindOfPayment: string;
  type: string;
}

export interface ITransactionsResponseDto {
  mainTotal: number;
  serviceTotal: number;
  total: number;
}
