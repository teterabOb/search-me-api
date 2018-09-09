'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_aut = require('../middlewares/authenticated');

//Modulo para guardar archivos
var multipart = require('connect-multiparty');
var mp_upload = multipart({ uploadDir : './uploads/users' });
 
api.get('/pruebas-del-controlador',md_aut.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/updateuser', md_aut.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_aut.ensureAuth, mp_upload], UserController.uploadImage);
api.get('/getimagefile/:imageFile',UserController.getImageFile );
api.get('/getusuarios',UserController.GetUsers );

module.exports = api;