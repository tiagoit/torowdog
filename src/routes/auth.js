const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');

var USERS = [
    { id: 1, name: 'tiago', pass: 'a4b3c2d1' },
    { id: 2, name: 'teste', pass: 'teste123' }
];

router.post('/', function(req, res) {
    const userFromDB = USERS.find(user => user.name == req.body.username);
    if(!userFromDB || req.body.password != userFromDB.pass) return res.sendStatus(401);

    var token = jwt.sign({userID: userFromDB.id}, config.get('jwtSecretToken'), {expiresIn: '1h'});
    res.send({token});
});

module.exports = router;
