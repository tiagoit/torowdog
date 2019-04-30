export class Wallet {
  _id: string;
  group: string;
  frequency: string; // Semanal|Mensal
  type: string;
  code: string;
  start: Date;
  end: Date;
  stocks: Stock[];

  constructor() {}
}

export class Stock {
  code: string;
  weight: number;

  constructor() {};
}