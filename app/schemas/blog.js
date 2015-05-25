/**
 * Created by luhuijian on 15/5/21.
 */
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var blogSchema = new Schema({
  blogtitle:{
    type: String,
    required: true
  },
  blogbody:{
    type: String,
    required: true
  },
  userId:{
    type: ObjectId,
    ref: 'User'
  },
  tags:{
    type: String
  },
  created: {
    type: Date,
    required: true
  },
  updated: {
    type: Date,
    required: true,
    'default': new Date()
  }
},{autoIndex: false});

blogSchema.pre('save',function(next){
  if(this.isNew){
    this.created = this.updated = Date.now();
  }else
  {
    this.updated=Date.now();
  }
  next();
});
module.exports = blogSchema;
