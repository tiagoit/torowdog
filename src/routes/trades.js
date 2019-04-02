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

// ############   Get trades by Name




module.exports = router;