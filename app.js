const express = require('express');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
const pgp = require('pg-promise')({});
const db = pgp({database: 'todo', user: 'postgres'});

const app = express();

app.use(body_parser.urlencoded({extended: false}));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

app.get('/todos', function(request, response) {
    db.any('SELECT * FROM task')
    .then(function(results) {
        response.render('index.html', {tasks: results});
    })
    .catch(function(error) {
        console.log(error);
    });
});

app.get('/todos/add', function(request, response) {
    response.render('add.html', {});
});

app.get('/todos/:id', function(request, response) {
    let id = request.params.id;
    db.none('UPDATE task SET done = True WHERE id = $1', [id])
    .then(function() {
        response.redirect('/todos');
    })
    .catch(function(error) {
        console.log("**ERROR** ", error);
        response.redirect('/todos');
    });
});

app.post('/add', function(request, response) {
    console.log(request.body);
    let desc = request.body.description;
    db.none('INSERT INTO task VALUES (default, $1, False)', [desc])
    .then(function() {
        response.redirect('/todos');
    })
    .catch(function(error) {
        console.log("**ERROR** ", error);
        response.redirect('/todos');
    });
});

app.listen(8080, function() {
    console.log("Listening on port 8080");
});