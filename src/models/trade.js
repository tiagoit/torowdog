const mongoose = require('mongoose');

const Trade = mongoose.model('Trade', new mongoose.Schema({
    toroID:         { type: Number,     required: true },
    created:        { type: Date,       required: true },
    edited:         { type: Date,       required: false },
    code:           { type: String,     required: true },
    operationType:  { type: String,     required: true, enum: ['DT'] },
    orderType:      { type: String,     required: true, enum: ['Buy', 'Sell'] },
    price:          { type: Number,     required: true },
    priceLimit:     { type: Number,     required: true },
    stopGain:       { type: Number,     required: true },
    stopLoss:       { type: Number,     required: true },
    closePrice:     { type: Number,     required: false }
}));



exports.Trade = Trade;