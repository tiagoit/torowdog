const express = require('express');
const router = express.Router();
const { Trade } = require('../models/trade');

// ############   Get all trades
router.get('/', async (req, res) => {
    try {
        console.log('endpoint: /trades - GET')
        const trades = await Trade.find();
        console.log('trades:', trades);
        res.send(trades);
    } catch (error) {
        return res.status(400).send(error);
    }
});

// ############   Get trades by code
router.get('/:code', async (req, res) => {
    try {
        console.log('endpoint: /trades/:code - GET: ',  req.params.code)
        const trades = await Trade.find({code: req.params.code});
        console.log('trades:', trades);
        res.send(trades);
    } catch (error) {
        return res.status(400).send(error);
    }
});




module.exports = router;