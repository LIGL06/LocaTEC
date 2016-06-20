var mongoose  = require("mongoose");
var Schema = mongoose.Schema;
var mongoURL = "mongodb://localhost:27017/locatec";

mongoose.connect(mongoURL, function(error){
  if (error) {
    throw error; return;
  }
  console.log("...Conexión a DB")
})

var posibles_tipos = ["utiles","ropa","trastes","otros"];
var objeto_schema = new Schema({
  id: String,
  type: String,
  imagen: String,
  description: String,
  fechaEntrada: String,
  fechaSalida: String
})

var Objeto = mongoose.model('Objeto', objeto_schema);
module.exports.Objeto = Objeto;
