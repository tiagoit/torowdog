const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

const {Event} = require('../models/trade');

// index
router.get('/', async (req, res) => {
    try {
        // TODO: se madruga então mostar eventos rolando
        const events = await Event.find({ 
            $or: [{
                    start: { 
                        $gte: moment().subtract(2, 'd'),
                        $lt: moment().add(60, 'd')
                    }
                }, { 
                    featured: { $eq: true }
                }]
        }).sort('start');

        let eventsByDate = []; // 0 = today | 1 = tomorrow (d+X)
        let featured = [];

        events.forEach((ev) => {
            if(featured.length < 9 && ev.featured) featured.push(ev);

            let day = moment(ev.start).startOf('day');
            let dateDiffInDays = (moment(day).diff(moment(), 'days')) + 1;
            if(eventsByDate[dateDiffInDays] === undefined) eventsByDate[dateDiffInDays] = [];
            eventsByDate[dateDiffInDays].push(ev);
        });

        res.render('./pages/index', {'events': eventsByDate, 'moment': moment});
    } catch (error) {
        return res.status(404).send(error);
    }
});

// página do evento | sulbaguia.com.br/evento/arraial-d-ajuda/morocha-club/mato-seco-e-guine
router.get('/evento/:city/:org/:eventCode', function(req, res) {
    res.render('./pages/about', {city: req.params['city'], org: req.params['org'], eventCode: ['eventCode']});
});

module.exports = router;
