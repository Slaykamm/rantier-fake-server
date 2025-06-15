export interface IRent {
  id: number;
  createAt: string;
  contract: string;
  contractDate: string;
  endContractDate: string;
  requestIndicatorsDate?: string;
  paymentDate: string;
  isActiveRent: boolean;
  amount: number;
  // // TODO убрать!
  // servicePaymentAmount: number;
  propertyId: number;
}
