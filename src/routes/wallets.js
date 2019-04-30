const express = require('express');
const router = express.Router();
const { Wallet } = require('../models/wallet');

router.get('/', async (req, res) => {
    res.send(await Wallet.find().sort({start: 1}));
});

router.get('/:id', async (req, res) => {
    res.send(await Wallet.findById(req.params.id));
});

router.post('/', async (req, res) => {
    res.send(await Wallet(req.body).save());
});

router.put('/:id', async (req, res) => {
    res.send(await Wallet.findOneAndUpdate({_id: req.body._id}, req.body));
});

router.delete('/:id', async (req, res) => {
    let wallet = await Wallet.findById(req.params.id);

    if(!wallet) res.status(500).send(`Wallet with this ID (${req.params.id}) not found.`);

    res.send(await wallet.delete());
});

module.exports = router;
