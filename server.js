var express = require('express')
var path = require("path")
var cointicker = require('coin-ticker')
var app = express()
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "source/templates"));
app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res, next) {
	try {
		res.render("homepage", { title: 'Home' })
	} catch (e) { next(e) }
})

app.get('/contact', function (req, res, next) {
	try {
		res.render("contact", { title: 'Contact' })
	} catch (e) { next(e) }
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
				console.log(exchange.toUpperCase() + ' : ' + sym + tick.last)
				res.write(exchange.toUpperCase() + ' : ' + sym + tick.last + '<br>')})
		}
		
		if (req.query.search.toUpperCase() === "BTC"){
			coin="BTC_USD"
		}
		
		exchange = ["bittrex","poloniex","bitfinex","kraken","okcoin","bitstamp","coinbase"]
		for(i=0;i<exchange.length-1;i++){
			ticker(exchange[i],coin)
		}
		setTimeout( function(){ res.end() }, 2000 );
	} catch (e) { next(e) }
})

app.listen(process.env.PORT || 80, function () {
  console.log('Listening on http://188.165.135.198:' + (process.env.PORT || 80))
})