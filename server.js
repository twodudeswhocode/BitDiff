var express = require('express')
var path = require('path')
var request = require('request')
var cointicker = require('coin-ticker')
var app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'source/templates'));
app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res, next) {
	try {
		res.render('homepage', { title: 'Home' })
	} catch (e) { next(e) }
})

app.get('/contact', function (req, res, next) {
	try {
		res.render('contact', { title: 'Contact' })
	} catch (e) { next(e) }
});

app.get('/searching', function (req, res, next) {
	var sym, coin, ref, exchanges, results
	sym = '฿'
	ref = req.query.search.toUpperCase()
	coin = ref + '_BTC'
	if(ref === '') ref = 'BTC'
	if(ref === 'BTC') coin = 'BTC_USD'
	if(ref === 'BTC' || ref == 'USD' || ref == 'USDT') sym = '$'
	exchanges = ['bittrex','poloniex','bitfinex','kraken','okcoin','bitstamp','coinbase'], exchangesGot = [], exchangesPoll = [], results = []
	coinPoll = ref
	if(coinPoll === 'BTC') coinRef = 'USD'
		else coinRef = 'BTC'
	var url = 'https://www.cryptocompare.com/api/data/coinsnapshot/?fsym=' + coinPoll + '&tsym=' + coinRef
	request({
		  url: url,
		  json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			for(let i = 0, l = body.Data.Exchanges.length; i < l; i++) {
				exchangesGot.push( body.Data.Exchanges[i].MARKET.toLowerCase() )
			}
			for (var z = 0; z < exchanges.length; z++) {
				for(var j = 0; j < exchangesGot.length; j++) {
					if(exchangesGot[j].indexOf(exchanges[z]) != -1) exchangesPoll.push(exchangesGot[j]);
				}
			}
			for(let i = 0, l = exchanges.length; i < l; i++) {
				results.push(cointicker(exchanges[i], coin))
			}
			Promise.all(results).then(successCallback).catch(failureCallback)
			function successCallback(found) {
				var html = ''
				for(let i = 0, l = found.length; i < l; i++) {
					if(sym === '$' && typeof found[i].last !== 'undefined') fprice = Number(found[i].last).toFixed(2)
							else fprice = Number(found[i].last).toFixed(8)
					if(found[i].exchange === undefined) html += ''
						else html += '<div class="col-sm-4 col-centered"><img class="centered" src="/images/' + found[i].exchange + '-ic.png" alt="' + found[i].exchange + '"><p class="centered">' + found[i].exchange + '<br>' + sym + fprice + '</p></div>'
				}
			if(html === '') html += '<p class="centered">That is not a valid currency.</p>'
			res.end(html)
			}
			function failureCallback(failure) { 
				res.end('Im sorry, your request could not be completed as typed. Please try again later.')
				console.log(failure)
			}
		}
	})
})

app.listen(process.env.PORT || 80, function () {
  console.log( 'Listening on http://bitdiff:' + (process.env.PORT || 80) )
})