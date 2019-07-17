'use strict' //activar el modo estricto(mejores formas de desarrollo)

var mongose = require('mongoose'); //importar el modulo monogose
var app = require('./app'); //usar la configuracion app.js
var port = process.env.PORT || 3999; //configirar puerto 

//CONEXION A MOGODB 
mongose.set('useFindAndModify', false); //evitar los warning al update
mongose.Promise = global.Promise; //trabajar con promesas
mongose.connect('mongodb://localhost:27017/api_rest_node', {useNewUrlParser: true})
        .then(() =>{
            console.log('Conexion con la Base de Datos se ha ejecutado correctamente');

            //CREAR EL SERVIDOR
            app.listen(port, () => {
                console.log('El servidor http://localhost:3999 està funcionando !');
            })
        })
        .catch(error => console.log(error));