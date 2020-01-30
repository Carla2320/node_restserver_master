const express = require('express');


const app = express();
const bodyParser = require('body-parser');
require('./config/config')



const mongoose = require('mongoose');
//Llamamos a MongoDB
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// y usamos los datos dependiendo de la accion (POST, GET,PUT)
app.use(bodyParser.json())


app.use(require('./routes/usuario'));
//Conectamos a la base de datos 
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
//Con mensajes de error si es que no hay conexion
        if (err) throw err;

        console.log('Base de datos ONLINE!');
    });
//Escucha el puerto
app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto", process.env.PORT);
});