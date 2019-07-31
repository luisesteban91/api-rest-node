'use strict'
var validator = require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs'); // librerias internas ya en nodejs
var path = require('path');// librerias internas ya en nodejs

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

        if(!validate_email){
            return res.status(200).send({
                message: "mail no puede ser vacio",
            });
        }
        

        //eliminar propieades innecesarias
        delete params.password;

        //obetener el id del usuario identificado
        var userId = req.user.sub;

        //comprobar si el email es unico
        if(req.user.email == params.email){
            console.log('entra aqui')
            User.findOne({email: params.email.toLowerCase()}, (err, user) =>{
            
                if(err){
                    return res.status(500).send({
                        message:"Error de Usaurio o contreseña"
                    })
                }
    
                if(user && user.email != params.email){
                    return res.status(200).send({
                        message: "El email no puede se modificado",
                    })
                }else{
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
            })
        }
        if(req.user.email != params.email){
            return res.status(200).send({
                status: "error",
                message: "El mail no corresponde al usuario"
            });
        }
    },
    uploadAvatar: function(req, res){
        //configurar el modulo multiparty (middleware) ->routes/user.js
            
        //recoger el fichero
        var file_name = 'Avatar no subido';
        
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            })
        }

        //conseguir el nombre y la extenicion del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('/');
        
        //nombre del archivo
        var file_name = file_split[2];

        //extencion del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        //comprobar extencion (solo imagenes), si no es valida borrar fchero subido
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            fs.unlink(file_path, (err) => { //unlink->boorar archivos
                
                    return res.status(200).send({
                        status: "error",
                        message: "la extencion del archivo no es valida",
                    });
                
            });
        }else{

            //Sacar el id del usuario identificado
            var userId = req.user.sub;

            //Buscar y actualizar documento
            User.findOneAndUpdate({_id:userId}, {image: file_name}, {new:true}, (err, userUpdate) => {
                if(err || !userUpdate){
                    return res.status(500).send({
                        status: "error",
                        message: "error al subir imagen"
                    });
                }
                //devolver respuesta
                return res.status(200).send({
                    status: "success",
                    message: "upload avatar",
                    user: userUpdate
                });
            });
        }
    },
    avatar: function(req, res){
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/'+fileName;
        fs.exists(pathFile, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(pathFile));
            }else{
                return res.status(404).send({
                    message: "La imagen no existe"
                })
            }
        })
    },
    getUsers: function(req, res){
        User.find().exec((err, users) => {
            if(err || !users){
                return res.status(404).send({
                    status:'error',
                    message: 'no hay usuarios que mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            })
        });
    },

    getUser: function(req, res){
        console.log(req.params);
        var userId = req.params.userId;

        User.findById(userId).exec((err, user) => {
            if(err || !user){
                return res.status(404).send({
                    status:'error',
                    message: 'no existe el usuario'
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            })
        })

    }
};

module .exports = controller; //Exportarlo y poder usarlo en cualquier lugar obviamente importarlo en donde se necesite
