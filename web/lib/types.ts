export interface Car {
  id: number;
  plate: string;
  province: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  note: string;
}

export type CarInput = Omit<Car, "id">;