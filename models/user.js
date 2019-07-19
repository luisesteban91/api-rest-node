'use strict'

var mongose = require('mongoose'); //export mongose
var Schema  = mongose.Schema; // crar esquema

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String
});

//quitar la contraseña par no mostrarla
UserSchema.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.password;

    return obj;
}

//Exportar
module.exports = mongose.model('User', UserSchema);
                                //lowercase y plularizar el nombre
                                //users -> documentos(schema)