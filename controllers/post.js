'use strict'
//modulos
var fs = require('fs');
var path = require('path');
//modelos
var User = require('../models/user');
var Post = require('../models/post');
//servicio jwt
var jwt = require('../services/jwt');

//acciones

function pruebas(req, res) {
    res.status(200).send({
        message: 'probando el controlador usuarios'
        
    })
};

module.exports = {
    pruebas
}