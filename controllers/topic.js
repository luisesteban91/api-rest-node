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
        
    }
}

module.exports = controller;