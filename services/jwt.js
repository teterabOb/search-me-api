'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta'

exports.createToken = (user) => {
    const { _id, name, surname, email, password, rol, image } = user;
    var payload = {
        //sub es propiedad que identifica al user
        sub: _id,
        name,
        surname,
        email,
        rol,
        image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret)
};