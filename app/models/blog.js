/**
 * Created by luhuijian on 15/5/21.
 */
var mongoose = require('mongoose');
var blogSchema = require('../schemas/blog');
var Blog = mongoose.model('Blog',blogSchema);

module.exports = Blog;
