import { ICounter } from "./counter.model";

export interface IIndications {
  id: number;
  counterId: ICounter;
  value: number;
  createAt: string;
}
