var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');

app.set('views', './src/views');
app.set('view engine', 'jade');
var connectionString = "postgres://" + process.env.POSTGRES_USER + "@localhost/kevin_database";

app.get('/', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('select * from messages', function(err, result) {


			response.render('index', {
				messages: result.rows
			});
		});
	});
});
app.get('/users/messagetable', function(request, response) {
	response.render('users/messagetable');
});

app.post('/users/messagetable', bodyParser.urlencoded({
	extended: true
}), function(request, response) {
	var inputtitle = request.body.titeltje;
	var inputbody = request.body.bodietje;

	pg.connect(connectionString, function(err, client, done) {
		client.query('insert into messages(title, body) values ($1, $2)', [inputtitle, inputbody], function(err) {
			if (err) {
				throw err;
			}
			console.log("jajaja");
			done();
			pg.end();
			response.redirect('/')
		});
	});
});



var server = app.listen(3000, function() {
	console.log('Example app listening on port: ' + server.address().port);
})