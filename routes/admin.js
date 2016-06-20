var express = require('express');
var stormpath = require('express-stormpath');
var multer = require('multer');
var cloudinary = require('cloudinary');
var Objeto  = require('../modelos/objetos').Objeto;
var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, 'uploads/')
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname + '-'+Date.now()+'.jpg')
  }
})
var upload = multer({storage:storage})
var router = express.Router();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
})

/* GET home page. */
router.get('/', stormpath.loginRequired,function(req, res, next) {
  res.render('admin/index', { title: 'Panel de administración' });
});
router.get('/nuevo', stormpath.loginRequired,function(req, res, next) {
  res.render('admin/new', { title:'Agregar objeto' });
});


router.post('/nuevo',upload.single('imagen'), function(req, res, next) {
  var data = new Objeto({
    id: req.body.objectid,
    description: req.body.descripcion,
    type: req.body.tipo,
    fechaEntrada: req.body.fechaEntrada,
    imagen: req.file.filename
  })
  res.send(data)
      data.save(function(error){
        console.log(data);
      })
})

module.exports = router;
