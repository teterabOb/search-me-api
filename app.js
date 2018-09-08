'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar Rutas
var user_routes = require('./routes/user') ;

//Middlewares BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configurar cabeceras y cors

//Rutas base
app.use('/api', user_routes);

//Rutas body-parse
app.get('/probando', (req, res) => {
    res.status(200).send({message: "Este es el metodo probando"});
})


module.exports = app;