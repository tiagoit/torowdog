const mongoose = require('mongoose');

const Analysis = new mongoose.Schema({
  edited: { type: Date, required: false },
  about: String,
  positive: String,
  negative: String,
  summary: String,
  analist: Number
});

const CompanyNumbers = new mongoose.Schema({
  edited: { type: Date, required: false },
  valorTotal: Number,
  receitaLiquida: Number,
  numeroAcoes: Number,
  pl: Number,
  resultado: Number,
  dividendos: Number,
  beta: Number
});

const Company = mongoose.model('Company', new mongoose.Schema({
  created: { type: Date,   required: true },
  edited: { type: Date,   required: false },
  toroID:   { type: Number, required: true },
  name:     { type: String, required: true },
  code:     { type: String, required: true },
  icon:     { type: String, required: true },
  market: String,
  analysis: [Analysis],
  companyNumbers: [CompanyNumbers]
}));

exports.Company = Company;
exports.Analysis = Analysis;
exports.CompanyNumbers = CompanyNumbers;

