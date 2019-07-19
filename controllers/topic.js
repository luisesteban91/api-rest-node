'use strict'

var validator = require('validator');
var Topic = require('../models/topic');
// var bcrypt = require('bcrypt-nodejs');
// var jwt = require('../services/jwt');
// var fs = require('fs'); // librerias internas ya en nodejs
// var path = require('path');// librerias internas ya en nodejs

var controller = {
    test : function(req, res) {
        return res.status(200).send({
            message: "controlador de Topic"
        })
    },

    save: function(req, res){
        //recoger parametros por post
        var params = req.body;
        console.log(params);

        //validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        } catch (error) {
            return res.status(200).send({
                message: "faltan datos por enviar",
                error
            });
        }

        if(validate_title && validate_content && validate_lang){
            //crear objeto a guardar
            var topic = new Topic();

            //asignar valores
            topic.title = params.test;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;

            //Guardar topic
            topic.save((err, topicSave) => {
                if(err || !topicSave){
                    return res.status(404).send({
                        message: 'el tem no se a guardado',
                        status: 'error'
                    })
                }
                //devolver una respeusta
                return res.status(200).send({
                    status: 'success',
                    topic: topicSave
                })
            })
        }else{
            //devolver una respeusta
            return res.status(200).send({
                message: "Los datos no son validos"
            })
        }
    },

    getTopics: function(req, res){
        //cargar la libreria de paginacion en la clase
        

        //recoger la pagina actual
        if(!req.params.page || req.params.page == undefined || req.params.page == null || req.params.page == '0' || req.params.page == 0){
            var page = 1;
        }else{
            var page = parseInt(req.params.page);//page se declaro en la ruta
        }

        //indicar las opciones de paginacion
        var options = {
            sort: {date:-1 }, //-1 tipo de orden
            populate: 'user', //el id de usuario que creo el topics
            limit: 5,
            page: page
        }

        //Find paginado
        Topic.paginate({}, options, (err, topics) => {
            if(err){
                return res.status(500).send({
                    status: "error",
                    message: "error al hacer la consulta",
                    err, err
                })
            }
            
            if(!topics){
                return res.status(404).send({
                    message: "no hay Topics",
                    status: "error"
                })
            }

            //devolver resultado (topics, total de topics, total del paginas)
            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalDocs: topics.totalDocs,
                totalPages: topics.totalPages
            })
        })
    },
    getTopicsByUser: function(req, res){
        //Conseguir el id de usaurio
        var userId = req.params.user;

        //Find con la condicion de usuario
        Topic.find({
            user: userId
        })
        .sort([['date', 'descending']])
        .exec((err, topics) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "Error en la peticion"
                })
            }

            if(!topics){
                return res.status(404).send({
                    status: 'error',
                    message: "No hay temas par mostrar"
                })
            }

            //devolver resultado
            return res.status(200).send({
                status: 'success',
                topics
            })
        })
    },

    getTopic: function(req, res){
        //sacar el id del topic del url
        var topicId = req.params.id;

        //find por id  del topic
        Topic.findById(topicId).populate('user').exec((err, topic) => {//populate obtener el obejto de user que esta en otra entidad
            //devolver resultado
            if(err){
                return res.status(200).send({
                    status: 'success',
                    message: 'error en la peticion'
                }) 
            }
            if(!topic){
                return res.status(200).send({
                    status: 'error',
                    message: 'no existe tema'
                }) 
            }
            return res.status(200).send({
                status: 'success',
                topic
            })  
        });            
    },
    update: function(req, res){
        //Recoger el id del topic de la url
        var  topicId = req.params.id;

        //recoger losd atos que llegan del post
        var params = req.body

        //validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        } catch (error) {
            return res.status(200).send({
                message: "faltan datos por enviar",
                error
            });
        }

        if(validate_title && validate_content && validate_lang){
            //Montar un json con los datos modfiicables
            var update = {
                title:params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            };

            //Find and update del topic por id  y por id de usuario
            Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new:true}, (err, topicUpdate) => {

                if(err){
                    return res.status(500).send({
                        status: "error",
                        message: 'error en la peticicon'
                    });
                }
                if(!topicUpdate){
                    return res.status(404).send({
                        status: "error",
                        message: 'no se ha actualizado el tema'
                    });
                }
                //devolver respuesta
                return res.status(200).send({
                    status: "success",
                    topic:topicUpdate
                });
            });

        }else{
            //devolver respuesta
            return res.status(200).send({
                message: "la validacion de los datos no es correcta"
            })
        }
    },
    delete:  function(req, res){
        //Sacar el Id del topic del la url
        var topicId = req.params.id;

        //Find and delete por topicID y por userID
        Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err, topicDelete) => {
            if(err){
                return res.status(500).send({
                    status: "error",
                    message: 'error en la peticion'
                })
            }
            if(!topicDelete){
                return res.status(404).send({
                    status: "error",
                    message: 'no se ha borrado el tema'
                })
            }
            //Devolver Respuesta
            return res.status(200).send({
                status: "success",
                topic: topicDelete
            })
        })
    }
}

module.exports = controller;