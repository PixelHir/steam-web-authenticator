var http = require('http');
var auth = require('basic-auth');
var SteamTotp = require('steam-totp');
var fs = require('fs');
var config = require('./config.js');
var server = http.createServer(function (req, res) {
var credentials = auth(req);
	if (!credentials || credentials.name !== config.username || credentials.pass !== config.password) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Secured access"');
		res.end('Access denied');
	} else {
		if(req.url == '/') {
			fs.readFile('./index.html', function (err, html) {
			res.end(html);
		});
		} else if(req.url == '/raw') {
			var code =  SteamTotp.generateAuthCode(config.secret);
			res.end(code);
		} else {
			res.end('<h1>404 not found</h1>');
		}
	}

});
server.listen(config.port);
