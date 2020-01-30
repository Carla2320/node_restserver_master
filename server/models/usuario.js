const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-beautiful-unique-validation');
//Realizamos los roles dentro de la variable roles Validos 
let rolesValidos = {
    values: ['ADMIN_ROLE', "USER_ROLE"],
    message: '{VALUE} no es un rol válido'
};
///Conexion de datos con mondoDB
let Schema = mongoose.Schema;

//Realizamos la variiable usuarioSchema donde vamos a ir 
//poniendo los campos de nombre, email, password, etc
//con sus caracteristicas ya sea el tipo de dato,
//si es requerido o no
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es requerido']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    goole: {
        type: Boolean,
        default: false
    }
});

///Realizamos una funcion donde por medio de objetos
//usamos el usuario y el password
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}


usuarioSchema.plugin(uniqueValidator);
//Exportamos el usuario que se creo con los atributos realizados
module.exports = mongoose.model('Usuario', usuarioSchema);