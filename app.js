'use strict'

//REQUIRES
var express = require('express');
var bodyParser = require('body-parser');// convertir lo que llegue port http a objectos de javascript

//EJECUTAR EXPRESS
var app = express();//activar el fraemworj express

//CARGAR ARCHIVO DE RUTAS
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');

//MIDDLEWARES
app.use(bodyParser.urlencoded({extend:false})); //configuracion necesaria para que body parse funcione
app.use(bodyParser.json()); //para convertir a json

//CORS

//REESCRIBIR RUTAS
app.use('/api', user_routes); //midleware para añadir adelante de cada ruta "/api", a las rutas de user_routes
app.use('/api', topic_routes); //midleware para añadir adelante de cada ruta "/api", a las rutas de topic_routes




//ruta metodo prueba
// app.get('/prueba', (req, res) => {
//     return res.status(200).send({
//         nombre: "luis esteban",
//         message: "Hola mundo desde el back-end con Node"
//     });
// });

//EXPORTAR MODULO PARA PODER USARLAS FUERA (en otro archivo al exportarlo)
module.exports = app;