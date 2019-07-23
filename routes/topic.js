'use strict'

var express = require('express'); //importar express que es para crear rutas
var TopicController = require('../controllers/topic'); //importar el controlador topic.js

var route = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas de Topics
route.get('/test', TopicController.test);
route.post('/topic', md_auth.authenticated, TopicController.save);
route.get('/topics/:page?', TopicController.getTopics);
route.get('/user-topics/:user', TopicController.getTopicsByUser);
route.get('/topic/:id', TopicController.getTopic);
route.put('/topic/:id', md_auth.authenticated, TopicController.update);
route.delete('/topic/:id', md_auth.authenticated, TopicController.delete);
route.get('/search/:search', TopicController.search);

module.exports = route; //exportar las rutas para poder usarlas