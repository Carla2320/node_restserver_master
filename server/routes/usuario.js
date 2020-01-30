const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();
//Creamos un servicio get que me muestra un limite y le damos el formato de 
///Number 
app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
//Buscamos dentro de la variable usuario que heredamos de la otra clase usuario
    Usuario.find({}, 'nombre email role goole img')
    //damos como parametros los limites y ejecucion
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
//Creamos una validacion si es que nos de el error 400.
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
//Usuario tambien va a contar cuantos usuarios existen.
            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios

                });
            });
        });
});
//Accion de post
app.post('/usuario', function(req, res) {

    let body = req.body;
//UNA variable de usuarrio donde guardamos los resultados a la base
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    });
//Se guarda y validamos con mensaje de error
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});
//Accion put
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /* Solucion no eficiente 
    delete body.password;
    delete body.goole;
    */
//Funcion para actualizar datos con su respectiva validacion de errores.
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
//Acción delete
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
//por medio del id creamos funciones que haga la accion de eliminar
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        //validación de errores
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
//Validacion si se busca un usuario que no exisite y se desea eliminar
//Nos saldrá el siguiente error
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;