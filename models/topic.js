'use strict'

var mongose = require('mongoose'); //export mongose
var Schema  = mongose.Schema; // crar esquema

//modelo de  COMMENT
var CommentSchema = Schema({
    content: String,
    date: { type: date, default: Date.now },
    user: { type: Schema.objectId, ref: 'User' }
});


var Comment = mongose.model('Comment', CommentSchema);
//modelo de TOPIC
var TopicSchema = Schema({
    title: String,
    content: String,
    email: String,
    code: String,
    lang: String,
    date: { type: date, default: Date.now },
    user: { type: Schema.objectId, ref: 'User' },
    comments: [CommentSchema]
});

module.exports = mongose.model('Topic', TopicSchema);
                                //lowercase y plularizar el nombre
                                //users -> documentos(schema)