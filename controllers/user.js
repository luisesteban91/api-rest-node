'use strict'
var validator = require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var controller = {
    probando : function(req, res){
        return res.status(200).send({
            message: "soy ek metodo probando"
        })
    },
    
    testeando: function(req, res){
        return res.status(200).send({
            message : "soy ek metodo testeando"
        })
    },
    save: function(req, res){
        //Recoger los parametros de la peticion
        var params = req.body; //recoger los datos

        //validar los datos
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (error) {
            return res.status(200).send({
                message: "faltan datos por enviar",
                error
            });
        }

        //console.log(validate_name, validate_surname, validate_email, validate_password);
        if(validate_name && validate_surname && validate_email && validate_password){
            //crar objeto de usuario
            var user = new User();

            //asignar valores al usuarios
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.role = 'ROLE_USER';
            user.image = null;

            //comprobar si el usaurio existe
            User.findOne({email: user.email}, (err, issetUser) => {
                if(err){
                    return res.status(500).send({
                        message: "Error al comprabar duplicidad de usuario",
                    });
                }
                if(!issetUser){
                    //si no existe

                    //cifrar la contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) =>{
                        user.password = hash;
                        
                        //guardar usuario
                        user.save((err, userSaved) =>{
                            if(err){
                                return res.status(500).send({
                                    message: "error al guardar usuario"
                                });
                            }
                            if(!userSaved){
                                return res.status(400).send({
                                    message: "El usuario no se ha guardado"
                                });
                            }
                            //devolcer respuesta
                            return res.status(200).send({
                                message: "success",
                                user: userSaved
                            });
                        });//close save
                    });//close bcrypt

                }else{
                    return res.status(200).send({
                        message: "El Usuario ya esta registrad0",
                    });
                }; 
            }); 
                

            
        }else{
            return res.status(200).send({
                message: "Validacion de los datos incorrectos",
                params
            });
        }
    },

    login: function(req, res){
        //recoger los parametros de la peticion
        var params = req.body;
        
        //Validar Datos
        try{
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (error) {
            return res.status(200).send({
                message: "faltan datos por enviar",
                error
            });
        }

        if(!validate_email ||  !validate_password){
            return res.status(200).send({
                message: "Los datos son incorrectos, envialos bien"
            })
        }
        //Buscar Usaurios que coincidan con el email
        User.findOne({email: params.email.toLowerCase()}, (err, user) =>{
            
            if(err){
                return res.status(500).send({
                    message:"Error de Usaurio o contreseña"
                })
            }

            if(!user){
                return res.status(404).send({
                    message:"El usuario no existe",
                    user
                })
            }
            //si lo encuentra
            //comprobar la contraseña(conicidencia de email y password / bcrypt)
            bcrypt.compare(params.password, user.password,(err, check) => {
                //si es correcto
                if(check){
                    //Generar Token de jwt y devolverlo (mas tarde)
                    if(params.gettoken){
                        //devolver datos
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        //limpiar el objeto
                        user.password = undefined;
                        //devolver datos
                        return res.status(200).send({
                            message:"success",
                            user,
                        })
                    }
                    
                }else{
                    return res.status(200).send({
                        message:"Las credenciales no son correctas",
                    })
                }

                
            });
        });
    },
    update: function(req, res){
        //crear middleware para comprobar el jwt token, ponerselo a la ruta

        //recoger datos del usaurio
        var params = req.body;

        //validar datos
        try {
           var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email); 
        } catch (error) {
            return res.status(200).send({
                message: "faltan datos por enviar",
                error
            });
        }
        

        //eliminar propieades innecesarias
        delete params.password;

        //obetener el id del usuario identificado
        var userId = req.user.sub;

        //buscar y actualizar documento
        //User.findOneAndUpdate(condicion, datos a actualizar, opciones, callback);
        User.findOneAndUpdate({_id: userId}, params, {new:true}, (err, userUpdate) => {//{new:true} obtener obejto de los datos nuevos
            if(err){
                //devolver respuesta
                return res.status(500).send({
                    status: "error",
                    message: "Error al actualizar usuario"
                });
            }
            if(!userUpdate){
                //devolver respuesta
                return res.status(200).send({
                    status: "error",
                    message: "no se a actualizado el usuario"
                });
            }
            //devolver respuesta
            return res.status(200).send({
                status: "success",
                user: userUpdate
            });
        }) 
    

        
    }
};

module .exports = controller; //Exportarlo y poder usarlo en cualquier lugar obviamente importarlo en donde se necesite
