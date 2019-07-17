'use strict'

var express = require('express'); //importar express que es para crear rutas
var UserController = require('../controllers/user'); //importar el controlador user.js

var route = express.Router();
var md_auth = require('../middlewares/authenticated');

//rutas de preuba
route.get('/probando', UserController.probando);
route.post('/testeando', UserController.testeando);

//rutas de usaurio
route.post('/register', UserController.save);
route.post('/login', UserController.login);
route.put('/update', md_auth.authenticated, UserController.update); //se ejecuta el middleware(md_auth.authenticated) para darle next y pasar al usecontroller, si es que esta validado el token

module.exports = route; //exportar las rutas para poder usarlas

//###### Se tiene que cargar el archivo de rutas en el app.js