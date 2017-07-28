var express = require('express');
var pug = require('pug');
var logger = require('morgan');
var cointicker = require('coin-ticker');
var sprintf=require("sprintf-js").sprintf;
//var bodyParser = require('body-parser');
var http = require('http');
//var request = require('request');
var app = express();
var templateHome = pug.compileFile(__dirname + '/source/templates/homepage.pug');
var templateCoin = pug.compileFile(__dirname + '/source/templates/contact.pug');

app.set("view engine", "pug");

app.use(logger('dev'));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res, next) {
	try {
		var html = templateHome({ title: 'Home' });
		res.send(html);
	} catch (e) {
		next(e);
	}
});

app.get('/contact', function (req, res, next) {
	try {
		var html = templateCoin({ title: 'Contact' });
		res.send(html);
	} catch (e) {
		next(e);
	}
});

app.get('/searching', function (req, res, next) {
	try {
		
		coin=req.query.search+"_BTC"
		sym="฿"
		
		function ticker(exchange,coin){
			if (coin === "BTC_USD") sym="$"
			cointicker(exchange,coin)
				.then((tick)=>{
				if(tick.last === undefined) return 1
				console.log(sprintf("%-10s: %s%f",exchange.toUpperCase(),sym,tick.last))
				res.write(sprintf("%-10s: %s%f<br>",exchange.toUpperCase(),sym,tick.last))})
		}

		if (req.query.search.toUpperCase() === "BTC"){
			coin="BTC_USD"
		}

		exchange = ["bittrex","poloniex","bitfinex","kraken","okcoin","bitstamp","coinbase"]
		for(i=0;i<exchange.length-1;i++){
			ticker(exchange[i],coin)
		}

		setTimeout( function(){ res.end() }, 2000 );

	} catch (e) {
		next(e);
	}
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://188.165.135.198:' + (process.env.PORT || 3000));
})
