const mongoose = require('mongoose');

const Stock = new mongoose.Schema({
  code: String,
  weight: Number
});

const Wallet = mongoose.model('Wallet', new mongoose.Schema({
    group:     { type: String, required: true },
    frequency: { type: String, required: true, enum: ['Semanal', 'Mensal'] },
    type:      { type: String, required: true },
    code:      { type: String, required: true },
    start:     { type: Date,   required: true },
    end:       { type: Date,   required: true },
    stocks:    { type: [Stock] }
}));

exports.Wallet = Wallet;