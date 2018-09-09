'use strict'

var express = require('express');
var PostController = require('../controllers/post');

var api = express.Router();
var md_aut = require('../middlewares/authenticated');

//Modulo para guardar archivos
var multipart = require('connect-multiparty');
var mp_upload = multipart({ uploadDir : './uploads/posts' });

api.get('/pruebas-post',md_aut.ensureAuth, PostController.pruebas);

module.exports = api;