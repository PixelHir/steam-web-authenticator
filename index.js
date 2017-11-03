var http = require('http');
var auth = require('basic-auth');
var SteamTotp = require('steam-totp');
var fs = require('fs');
var config = require('./config.js');
var SteamCommunity = require('steamcommunity');
var community = new SteamCommunity();
community.login({
	"accountName": config.steamusername,
	"password": config.steampassword,
	"twoFactorCode": SteamTotp.generateAuthCode(config.identity_secret)
}, function(err, sessionID, cookies, steamguard) {
if (err) { console.log("Error while logging to steam: " + err); } else { console.log("Logged in to steam"); }
var server = http.createServer(function (req, res) {
var credentials = auth(req);
	if (!credentials || credentials.name !== config.username || credentials.pass !== config.password) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Secured access"');
		res.end('Access denied');
	} else {
        if (req.url == '/') {
            fs.readFile('./pages/index.html', function (err, html) {
                res.end(html);
            });
        } else if (req.url == '/raw') {
            var code = SteamTotp.generateAuthCode(config.identity_secret);
            res.end(code);
        } else if (req.url == '/time') {
            var time = 30 - (SteamTotp.time() % 30);
            res.end(time.toString());
        } else if (req.url == '/confirmations') {
            community.getConfirmations(SteamTotp.time(), SteamTotp.getConfirmationKey(config.shared_secret, SteamTotp.time(), "conf"), function (err, confirmations) {
                if (err) { console.log(err); }
                var html = "<html>"
                res.end(JSON.stringify(confirmations));
            });
        } else if (req.url.startsWith('/accept/')) {
            var args = req.url.slice(8);
            res.end(req.url.slice(8));
        } else if (req.url == '/acceptall') {
            community.acceptAllConfirmations(SteamTotp.time(), SteamTotp.getConfirmationKey(config.shared_secret, SteamTotp.time(), "conf"), SteamTotp.getConfirmationKey(config.shared_secret, SteamTotp.time(), "allow"), function (err, confs) {
                if (err) { res.end(err); }
                if (confs) { res.end(JSON.stringify(confs)); }
            });
        } else {
			res.end('<h1>404 not found</h1>');
		}
	}

});
server.listen(config.port);
});
