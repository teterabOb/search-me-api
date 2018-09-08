'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema({
    description: String,
    short_description: String,
    date: Date,
    category: category,
    user: { type: Schema.ObjectId, ref: 'User' }

});

module.exports = mongoose.model('Post', PostSchema, 'Posts')