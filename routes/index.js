var express = require('express');
var mongoose = require('mongoose');
var Objeto = require('../modelos/objetos').Objeto;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Objeto.find(function(error, objeto){
    if (error) {
      console.log(error);
    }
    res.render('index', {objetos:objeto, title: 'LocaTEC'})
  })
});

module.exports = router;
