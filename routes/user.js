'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_aut = require('../middlewares/authenticated');
 
api.get('/pruebas-del-controlador',md_aut.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser)
api.post('/login', UserController.login)

module.exports = api;