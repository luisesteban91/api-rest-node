'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave-secreta-para-generar-token";

exports.authenticated = function(req, res, next){

    //comprobar si llega autorizacion
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "la peticion no tiene la cabecera de autorization"
        })
    }

    //limpiar el token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g, ''); //remplazar '" por nada
    try {
        //decodificar token
        var payload = jwt.decode(token, secret);

        //comprobar la expiracion del token
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: 'El token a expirado'
            });
        }        
        
    } catch (ex) {
        return res.status(404).send({
            message: 'El token no es valido'
        });
    }
    //adjuntar usuario identificado a la request
    req.user = payload;
    
    //pasar a la accion
    next();
};