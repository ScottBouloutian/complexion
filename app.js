var express = require('express');
var app = express();
app.use('/assets', express.static('assets'));
app.use('/scripts', express.static('scripts'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.listen(8080, 'localhost');
console.log('server running on http://localhost:8080');
