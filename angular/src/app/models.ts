export class Trade {
    _id: string;
    toroID: number;
    closePrice: number;
    code: string;
    created: Date;
    edited: Date;
    operationType: string;
    orderType: string;
    price: number;
    priceLimit: number;
    stopGain: number;
    stopLoss: number;

    constructor() {}
}