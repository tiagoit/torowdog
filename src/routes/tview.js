const express = require('express');
const router = express.Router();
var http = require("http");
var https = require("https");
var htmlparser = require("htmlparser2");

router.get('/', async (req, res) => {
  // let url = 'https://www.tradingview.com/symbols/BMFBOVESPA-LREN3/technicals';
  // if(url === undefined) {
  //   res.send({message: "url cannot be undefined"});
  // }
  // var urlPrefix = url.match(/.*?:\/\//g);
  // url = url.replace(/.*?:\/\//g, "");
  // var options = {
  //     hostname: url
  // };
  var options = {
    host: 'www.tradingview.com',
    path: '/symbols/BMFBOVESPA-LREN3/technicals',
    port: 443
  };
  // if(urlPrefix !== undefined && urlPrefix !== null && urlPrefix[0] === "https://") {
      // options.port = 443;
      console.log(options);
      https.get(options, function(result) {
          processResponse(result, req, res, options);
      }).on('error', function(e) {
          res.send({message: e.message});
      });
  // } else {
  //     // options.port = 80;
  //     console.log(options);
  //     http.get(options, function(result) {
  //         processResponse(result);
  //     }).on('error', function(e) {
  //         res.send({message: e.message});
  //     });
  // }

  // res.send({status: 'ok'});
});

var processResponse = function(result, req, res, options) {
  var data = "";
  result.on("data", function(chunk) {
    console.log('chunk', chunk);
      data += chunk;
  });
  var tags = [];
  var tagsCount = {};
  var tagsWithCount = [];
  result.on("end", function(chunk) {
      var parser = new htmlparser.Parser({
          onopentag: function(name, attribs) {
              if(tags.indexOf(name) === -1) {
                  tags.push(name);
                  tagsCount[name] = 1;
              } else {
                  tagsCount[name]++;
              }
          },
          onend: function() {
              for(var i = 0; i < tags.length; i++) {
                  tagsWithCount.push({name: tags[i], count: tagsCount[tags[i]]});
              }
          }
      }, {decodeEntities: true});
      parser.write(data);
      parser.end();
      res.send({website: req.query.url, port: options.port, data: data, tags: tagsWithCount});
  });
}


module.exports = router;
