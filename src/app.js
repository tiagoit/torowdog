const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); 
const expressJwt = require('express-jwt');
const config = require('config');

const moment = require('moment-timezone');
moment.locale('pt-BR');
moment.tz.setDefault('America/Sao_Paulo');

const app = express();
const DEBUG = process.env.NODE_ENV !== 'production';
const PORT = DEBUG ? '8080' : process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../public'));

// Connect to MongoDB (hosted on GCE Instance)
mongoose.connect('mongodb://35.231.67.98/torowdogdb', { 
    useNewUrlParser: true,
    auth: { authdb: "torowdogdb" },
    user: "appenginetwd",
    pass: "8ds7f9ds87f97ds9f898s09ad80f87sa0f8"
}).then(() => console.log('Connected to MongoDB...'))
.catch((err) => console.log('Cannot connect to MongoDB: ', err));


// Auth 
// app.use(expressJwt({secret: config.get('jwtSecretToken')}).unless({path: ['/api/auth', '', '/', '/about']}));
app.use('/api/auth', require('./routes/auth'));

// API Routes
app.use('/api/loader', require('./routes/loader'));
app.use('/api/trades', require('./routes/trades'));

// Public website
app.use('/', require('./routes/public'));

const server = app.listen(PORT, function () {
    console.log('Express listening on port %s', PORT);
});
