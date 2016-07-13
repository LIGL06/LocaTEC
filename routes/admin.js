var express = require('express');
var stormpath = require('express-stormpath');
var multer = require('multer');
var cloudinary = require('cloudinary');
var Objeto  = require('../modelos/objetos').Objeto;
var fs = require('fs');
var methodOverride = require('method-override');
var default_avatar = 'defualt.png';
var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, 'public/uploads')
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname + '-'+Date.now()+'.jpg')
  }
})
var upload = multer({storage:storage})
var router = express.Router();
var app = express();
app.use(methodOverride('_method'));

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
})

/* GET home page. */
router.get('/',stormpath.loginRequired,function(req, res, next) {
  Objeto.find(function(error, documento){
    Objeto.find(function(error, objeto){
      if (error) {
        console.log(error);
      }
      res.render('admin/index', {objetos:objeto, title: 'LocaTEC'})
    })
  })
});
router.get('/nuevo', stormpath.loginRequired,function(req, res, next) {
  res.render('admin/new', { title:'Agregar objeto' });
});
router.get('/editar/:id',stormpath.loginRequired,function(req, res, next){
  var id_objeto = req.params.id;
  Objeto.findOne({"_id":id_objeto}, function(error,objeto){
    if (error) {
      console.log(error);
    }else {
      // res.send(objeto);
      res.render('admin/editar',{objeto:objeto,title: 'Editar objeto'})
    }
  })
})
router.put('/:id',stormpath.loginRequired,function(req, res, next){
  var _id = req.params.id
  var data = new Objeto({
    _id: _id,
    id: req.body.objectid,
    description: req.body.descripcion,
    type: req.body.tipo,
    fechaEntrada: req.body.fechaEntrada
  })
  // res.send(data)
  Objeto.findOneAndUpdate({"_id":_id},data,function(error,objeto){
      if (error) {
      res.send(error)
      }else {
      res.redirect('/admin')
    }
  })
})
router.get('/eliminar/:id', stormpath.loginRequired,function(req, res, next){
  var _id = req.params.id;
  Objeto.findOne({"_id":_id}, function(error, objeto){
    res.render('admin/eliminar',{objeto:objeto, title:'Eliminar objeto', message:'Eliminar Objeto'})
  })
})
router.delete('/:id',stormpath.loginRequired, function(req, res, next){
  var _id = req.params.id;
  Objeto.findAndRemove({"_id":_id}, function(error){
    if (error) {
      res.send(error);
    }else {
      res.redirect('/admin')
    }
  })
})

router.post('/nuevo',upload.single('imagen'),stormpath.loginRequired, function(req, res, next) {
  var data = new Objeto({
    id: req.body.objectid,
    description: req.body.descripcion,
    type: req.body.tipo,
    fechaEntrada: req.body.fechaEntrada,
  })
  if (req.file) {
    data.imagen = req.file.filename;
    console.log(req.file.filename);
  }else{
    data.imagen = default_avatar;
  }
  data.save(function(error,objeto){
    if (error) {
      res.send(error);
    }else {
      res.redirect('/admin/nuevo');
    }
  })
})

module.exports = router;
