'use strict'

var Topic =require('../models/topic');
var validator = require('validator');

var controller = {
    add: function(req, res){
        //REcoger el id del topic de la url
        var topicId = req.params.topicId;

         //Find por id del topic
         Topic.findById(topicId).exec((err, topic) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!topic){
                return res.status(404).send({
                    status: 'error',
                    message: 'no existe el tema'
                });
            }

        //comprobar objeto usaurio y validar datos
        if(req.body.content){
            //validar datos
            try {
                var validate_content = !validator.isEmpty(req.body.content);
            } catch (error) {
                return res.status(200).send({
                    message: "no has comentado nada!",
                    error
                });
            }

            if(validate_content){
                var comment = {
                    user: req.user.sub,
                    content: req.body.content
                }
                //En la propiedad commments del objeto resultante hacer un push
                topic.comments.push(comment);

                //gaurdar el topic completo
                topic.save((err) =>{
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en guardar el comentario'
                        });
                    }

                    //devolver una respuesta
                    return res.status(200).send({
                        status: 'success',
                        topic
                    })
                })

                
            }else{
                return res.status(200).send({
                    message: "no se han validado datos del comentario !!",
                    error
                });
            }
        }
        });
    },

    update: function(req, res){
        //conseguir id de comentario que llega de la url
        var commentId = req.params.commentId;

        //Recoger datos y validar
        var params = req.body;

        //validar datos
        try {
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(200).send({
                message: "no has comentado nada!",
                error
            });
        }
        if(validate_content){
            //Find and update de subdocuento
            Topic.findOneAndUpdate(
                {"comments._id": commentId },
                {
                    "$set": {
                        "comments.$.content": params.content
                    }
                },
                {new:true},
                (err, topicUpdate) =>{
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la peticion'
                        });
                    }
                    if(!topicUpdate){
                        return res.status(404).send({
                            status: 'error',
                            message: 'no existe el tema'
                        });
                    }

                    //Devolver datos
                    return res.status(200).send({
                        status: 'success',
                        topic: topicUpdate
                    })
            });
        }
    },

    delete: function(req, res){
        //Sacar el id del topic y del comentario a borrar
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;

        //Buscar el topic
        Topic.findById(topicId, (err, topic) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!topic){
                return res.status(404).send({
                    status: 'error',
                    message: 'no existe el tema'
                });
            }

            //Selecionar el subdocumento (comentario)
            var comment = topic.comments.id(commentId);
            console.log(commentId);

            //borrar el comentario
            if(comment){
                comment.remove();

                //Guardar el topic
                topic.save((err) => {
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la peticion'
                        });
                    }
                    //Devolver un resultado
                    return res.status(200).send({
                        status: 'success',
                        topic
                    })
                })  
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'no existe el comentario'
                });
            }
        })

    }
};

module.exports = controller;