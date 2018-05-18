var express = require('express');
var nunjucks = require('nunjucks');
var pgp = require('pg-promise')({});
var db = pgp({database: 'todo', user: 'postgres'});

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

app.get('/todos', function(request, response) {
    db.any("SELECT * FROM task")
    .then(function(results) {
        response.render('base.html', {tasks: results});
    })
    .catch(function(error) {
        console.log(error);
    });
});

app.listen(8080, function() {
    console.log("Listening on port 8080");
});