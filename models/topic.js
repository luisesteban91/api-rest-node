'use strict'

var mongoose = require('mongoose'); //export mongose
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema  = mongoose.Schema; // crar esquema

//modelo de  COMMENT
var CommentSchema = Schema({
    content: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});


var Comment = mongoose.model('Comment', CommentSchema);
//modelo de TOPIC
var TopicSchema = Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    comments: [CommentSchema]
});

//CArgar paginacion 
TopicSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Topic', TopicSchema);
                                //lowercase y plularizar el nombre
                                //users -> documentos(schema)