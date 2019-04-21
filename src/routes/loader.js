const express = require('express');
const fs = require("fs");
const IncomingForm = require('formidable').IncomingForm;
const router = express.Router();
const config = require('config');
const sharp = require('sharp');
const { Trade } = require('../models/trade');
const { Company, Analysis, CompanyNumbers } = require('../models/company');

const toroOperationTypes = {"DAY": "DT", "SWING": "ST"};
const toroOrderTypes = {"C": "Buy", "V": "Sell"}


// ############   LOAD TRADES HISTORY JSON
router.post('/', async (req, res) => {
    try {
        var form = new IncomingForm();
        let _file;

        form.on('file', (field, file) => {
            _file = file;
        });
 
        form.on('end', async () => {
            let trades = JSON.parse(fs.readFileSync(_file.path));
            for(let i=0; i<trades.length; i++) {
                const trade = buildTrade(trades[i]);
                await upsertCompany(trades[i]);
                Trade.updateOne({ "toroID": trade.toroID }, trade, {upsert: true}).exec();
            }
            res.json(_file);
        });

        form.parse(req);
    } catch (ex) {
        for(field in ex.errors) console.log(ex.errors[field]);
        return res.status(400).send(ex.errors);
    }
});

function buildTrade(rawTradeObject) {
    let e = {};
    e.toroID        = rawTradeObject['id'];
    e.created       = rawTradeObject['criado'];
    e.edited        = rawTradeObject['editado'];
    e.code          = rawTradeObject['empresa']['codigo'];
    e.operationType = toroOperationTypes[rawTradeObject['tipo_operacao']['tipo']];
    e.orderType     = toroOrderTypes[rawTradeObject['tipo_ordem']];
    e.price         = rawTradeObject['compra'].replace(',', '.');
    e.priceLimit    = rawTradeObject['compra_maxima'].replace(',', '.');
    e.stopGain      = rawTradeObject['objetivo'].replace(',', '.');
    e.stopLoss      = rawTradeObject['stop'].replace(',', '.');
    e.closePrice    = rawTradeObject['preco_encerramento'].replace(',', '.');

    return e;
}

function numberParser(num) {
    let num_ = num.replace(/\.,/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    return num_;
}

async function upsertCompany(rawTradeObject) {
    // console.log('upsertCompany');
    let storedCompany = await Company.findOne({ toroID: rawTradeObject['empresa']['id'] });

    let analysis = {};
    analysis.edited = rawTradeObject['empresa']['editado'];
    analysis.about = rawTradeObject['empresa']['sobre'];
    analysis.positive = rawTradeObject['empresa']['pontos_positivos'];
    analysis.negative = rawTradeObject['empresa']['pontos_negativos'];
    analysis.summary = rawTradeObject['empresa']['resumo'];
    analysis.analist = rawTradeObject['empresa']['analista'];

    let companyNumbers = {};
    companyNumbers.edited = rawTradeObject['empresa']['editado'];
    companyNumbers.valorTotal = numberParser(rawTradeObject['empresa']['valor_total']);
    companyNumbers.receitaLiquida = numberParser(rawTradeObject['empresa']['receita_liquida']);
    companyNumbers.numeroAcoes = numberParser(rawTradeObject['empresa']['numero_acoes']);
    companyNumbers.pl = numberParser(rawTradeObject['empresa']['pl']);
    companyNumbers.resultado = numberParser(rawTradeObject['empresa']['resultado']);
    companyNumbers.dividendos = numberParser(rawTradeObject['empresa']['dividendos']);
    companyNumbers.beta = numberParser(rawTradeObject['empresa']['beta']);

    if(storedCompany) {
        let matchNumbers = false;
        storedCompany.companyNumbers.forEach(companyNumbers_ => {
            if(companyNumbers_.valorTotal == companyNumbers.valorTotal) matchNumbers = true;
        });
        if(companyNumbers.valorTotal && !matchNumbers) storedCompany.companyNumbers.push(companyNumbers);
        
        let matchAnalysis = false;
        storedCompany.analysis.forEach(analysis_ => {
            if(analysis_.summary === analysis.summary) matchAnalysis = true;
        });
        if(!matchAnalysis) storedCompany.analysis.push(analysis);

        if(!matchNumbers || !matchAnalysis) storedCompany.save();
    } else { // new company
        // // TODO: Store icon on GCS
        // const destFilePath = `images/company-icons/${rawTradeObject['empresa']['codigo']}}.svg`;
        // sharp(rawTradeObject['empresa']['icone']).toFile(resizedFilePath).then(info => {
        //     let gcsPublicUrl = `https://storage.googleapis.com/${config.get('bucketName')}/${destFilePath}`;
        //     storageService.uploadFile(resizedFilePath, destFilePath);
        //     res.json({'gcsPublicUrl': gcsPublicUrl});
        //     console.log('gcsPublicUrl: ', gcsPublicUrl);

        //     // Insert new object here
        // });

        let newCompany = new Company();
        newCompany.created = rawTradeObject['empresa']['criado'];
        newCompany.edited = rawTradeObject['empresa']['editado'];
        newCompany.toroID = rawTradeObject['empresa']['id'];
        newCompany.name = rawTradeObject['empresa']['nome'];
        newCompany.code = rawTradeObject['empresa']['codigo'];
        newCompany.icon = rawTradeObject['empresa']['icone'];
        newCompany.market = rawTradeObject['empresa']['mercado'];
        if(companyNumbers.valorTotal && companyNumbers.receitaLiquida) {
            newCompany.companyNumbers = companyNumbers;
        }
        newCompany.analysis = analysis;
        newCompany.save();
    }
}

module.exports = router;
