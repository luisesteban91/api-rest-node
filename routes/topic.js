'use strict'

var express = require('express'); //importar express que es para crear rutas
var TopicController = require('../controllers/topic'); //importar el controlador topic.js

var route = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas de Topics
route.get('/test', TopicController.test);
route.post('/topic', md_auth.authenticated, TopicController.save);

module.exports = route; //exportar las rutas para poder usarlas