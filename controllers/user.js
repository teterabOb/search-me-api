'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
//modelos
var User = require('../models/user');
//servicio jwt
var jwt = require('../services/jwt');

//acciones

function pruebas(req, res) {
    res.status(200).send({
        message: 'probando el controlador usuarios',
        user: req.user
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
                bcrypt.hash(task.password, null, null, async (err, hash) => {
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
                bcrypt.compare(password, issetUser.password, (err, check) => {
                    if (check) {
                        //comprobando y generar el token
                        if (gettoken) {
                            //devolver el token
                            return res.status(200).send({ token: jwt.createToken(issetUser) })

                        }
                        else {
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


function updateUser(req, res) {
    var userId = req.user.sub;
    var update = req.body;

    //res.status(200).send({ user: userId })

    if (userId != req.user.sub) {
        return res.status(500).send({ message: "No tienes permiso para actualizar el usuario" })
    } else {
        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
            if (err) {
                res.status(500).send({ message: "Error al actualizar el usuario" })
            }
            else {
                if (!userUpdated) {
                    res.status(404).send({ message: "No se ha podido actualizar el usuario" })
                }
                else {
                    res.status(200).send({ user: userUpdated })
                }
            }
        })
    }
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var fileName = 'No subido ...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split(`\/`);
        var file_name = file_split[2];
        var file_ext = file_name.split(`\.`)[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'svg') {
            if (userId != req.user.sub) {
                return res.status(500).send({ message: 'No tienes permiso para actualizar el usuario' });
            }

            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar el Usuario' });
                }
                else {
                    if (!userUpdated) {
                        res.status(400).send({ message: 'No se ha podido actualizar el usuario' });
                    }
                    else {
                        res.status(200).send({ user: userUpdated, image: file_name });
                    }
                }

            })
        }
        else {
            fs.unlink(file_path, err => {
                if (err) {
                    res.status(200).send({ message: 'Extension no valida y fichero no borrado' });
                }
                else {
                    res.status(200).send({ message: 'Extension no valida' })
                }
            })

        }
        //res.status(200).send({ file_path, file_split, file_name, file_ext });
    } else {
        res.status(200).send({ message: "No se han subido archivos" });
    }
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = `./uploads/users/${image_file}`;

    fs.exists(path_file, exists => {
        if (exists) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(404).send({ message: 'La imagen no existe' })
        }
    });

    //res.status(200).send({message: 'Accediendo a la imagen'})
}

function GetUsers(req, res) {
    User.find({ rol: 'admin' }).exec((err, users) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' })
        } else {
            if (!users) {
                res.status(400).send({ message: 'No hay usuarios' })
            } else {
                res.status(200).send({ users })
            }
        }
    })
    //res.status(200).send({ message: 'Lista de Usuarios' })
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    GetUsers
};