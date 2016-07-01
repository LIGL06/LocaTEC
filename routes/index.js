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
router.get('/filter/:id',function(req, res, next){
	  var id = req.params.id;
	  Objeto.find({"type":id},function(error, objeto){
	    if (error) {
	        res.send(error);
	    }else{
	        res.render('index',{objetos:objeto, title: 'Filtrado por ' + id})
	    }
	  })
})

module.exports = router;
