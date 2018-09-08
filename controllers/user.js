'use strict'


//modulos
var bcrypt = require('bcrypt-nodejs')

//modelos
var User = require('../models/user')

//servicio jwt
var jwt = require('../services/jwt')

//acciones

function pruebas(req, res) {
    res.status(200).send({
        message: 'probando el controlador usuarios',
        user : req.user
    })
};

function saveUser(req, res) {
    //Recoger parametros
    const { name, surname, email, password, rol, image } = req.body;
    const task = new User({ name, surname, email, password, rol, image });
    //Este User con mayuscula es el objeto de la coleccion
    //El user con minuscula es el que  devuelta el callback
    User.findOne({ email: task.email.toLowerCase() }, async (err, user) => {
        console.log("entro a esta mierda")
        if (err) {
            console.log("error" + err)

        } else {
            if (!user) {
                console.log("Puede guardar")
                 bcrypt.hash(task.password, null, null , async (err, hash) => {
                    task.password = hash;

                    await task.save();
                    res.json({ status: "tarea guardada" })
                 }) 
                
                
            }
            else {
                console.log("No puede guardar")
                res.json({ status: "No se puede guardar" })
            }
        }
    })
};

function login(req, res) {
    const { email, password, gettoken } = req.body;
    const task = new User({ email })

    User.findOne({ email: task.email.toLowerCase() }, (err, issetUser) => {
        if (err) {
            return res.status(500)
                .send({ message: "Error al comprobar el usuario" })
        }
        else {
            if (issetUser) {
                bcrypt.compare(password, issetUser.password, (err, check ) =>{
                    if(check){
                        //comprobando y generar el token
                        if(gettoken){
                            //devolver el token
                            return res.status(200).send({ token : jwt.createToken(issetUser)})

                        }
                        else{
                            return res.status(200).send({ issetUser })
                        }                        
                    }
                    else {
                        return res.status(404).send({ 
                            message: "El usuario no se ha podido loguear"
                        })
                    }
                })
                
            } else {
                return res.status(404).send({
                    message: "El usuario no existe"
                })
            }
        }
    })


}


module.exports = {
    pruebas,
    saveUser,
    login
};