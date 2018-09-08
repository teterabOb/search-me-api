'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

const URI = 'mongodb://localhost:27017/search'

mongoose.Promise = global.Promise;
mongoose.connect(URI, { useNewUrlParser: true })
    .then(() => {
        console.log("conexion exitosa")

        app.listen(port, () => {
            console.log("el servidor local con node y express está corriendo")
        })

    })
    .catch(err => console.log(err))
