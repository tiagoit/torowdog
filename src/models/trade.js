const mongoose = require('mongoose');

const Trade = mongoose.model('Trade', new mongoose.Schema({
    toroID:        { type: Number, required: true },
    created:       { type: Date,   required: true },
    edited:        { type: Date,   required: false },
    code:          { type: String, required: true },
    operationType: { type: String, required: true, enum: ['DAY', 'CPR', 'LPD', 'LPM', 'LPA'] },
    orderType:     { type: String, required: true, enum: ['C', 'V'] },
    price:         { type: Number, required: true },
    priceLimit:    { type: Number, required: true },
    stopGain:      { type: Number, required: true },
    stopLoss:      { type: Number, required: true },
    closePrice:    { type: Number, required: false }
}));

exports.Trade = Trade;



// tipo_operacao:
// DAY - Day trade
// CPR - Curto prazo
// LPD - Longo Prazo Dividendos
// LPM - Longo Prazo Moderada
// LPA - Longo Prazo Agressiva

// tipo_ordem: ['C'|'V']

// tipo_recomendacao: 
// ENC - Encerrada