const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require('cors');
const mongoose = require('mongoose'); 
const config = require('config');

const moment = require('moment-timezone');
moment.locale('pt-BR');
moment.tz.setDefault('America/Sao_Paulo');

const app = express();
const DEBUG = process.env.NODE_ENV !== 'production';
const PORT = DEBUG ? '8080' : process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

console.log('APP NAME (CONFIG): ', config.get('name'));

// Connect to MongoDB (hosted on GCE Instance)
mongoose.connect(config.get('mongodb.host'), config.get('mongodb.options'))
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Cannot connect to MongoDB: ', err));

app.use('/api/auth', require('./routes/auth'));

// API Routes
app.use('/api/loader', require('./routes/loader'));
app.use('/api/trades', require('./routes/trades'));
app.use('/api/wallets', require('./routes/wallets'));
app.use('/api/tview', require('./routes/tview'));

app.listen(PORT, function () {
    console.log('Express listening on port %s', PORT);
});
