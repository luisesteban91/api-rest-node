'use strict'

var express = require('express'); //importar express que es para crear rutas
var CommentController = require('../controllers/comment'); //importar el controlador comment.js

var route = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas de comment
route.post('/comment/topic/:topicId', md_auth.authenticated, CommentController.add);
route.put('/comment/:commentId', md_auth.authenticated, CommentController.update);
route.delete('/comment/:topicId/:commentId', md_auth.authenticated, CommentController.delete); //commentId se utiliza esta variable en controllers comment en delete

module.exports = route; //exportar las rutas para poder usarlas