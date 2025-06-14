export interface ITransactions {
  id: number;
  createAt: string;
  rentId: number;
  amount: number;
  kindOfPayment: string;
  type: string;
}

export interface ITransactionsResponseDto {
  mainTotal: number;
  serviceTotal: number;
  total: number;
}
