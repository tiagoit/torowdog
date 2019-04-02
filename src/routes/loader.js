const express = require('express');
const fs = require("fs");
const IncomingForm = require('formidable').IncomingForm;
const router = express.Router();
const { Trade } = require('../models/trade');

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
    let toroOperationTypes = {"DAY": "DT", "SWING": "ST"};
    let toroOrderTypes = {"C": "Buy", "V": "Sell"}

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

module.exports = router;
