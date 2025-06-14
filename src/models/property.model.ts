export interface IProperty {
  id: number;
  name: string;
  address: string;
  label?: string;
  image?: string;
  rooms: number;
  area: number;
  isRented: boolean;
}
