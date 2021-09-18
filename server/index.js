var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
const mysql = require('mysql');

var isConnect = false;

var con = mysql.createConnection({
  host: "mysql5046.site4now.net",
  user: "a79446_mobile",
  password: "admin123",
  database: "db_a79446_mobile"
});


connectMYSQL();

function connectMYSQL(){
  con.connect(function(err) {
    if (err)
      isConnect = false;
    else
      isConnect = true;
  });
}

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors()); // {origin :'http://localhost:8090'}


app.get('/Products', function(req, res) {
  if(con.state === con.Connected){
    connectMYSQL();
    if(!isConnect){
      res.send([[{result: 'failConect'}]]);
      return;
    }
  }
  var sql = 'SELECT * FROM productos';
  con.query(sql, function (err, rows) {
    if (err) 
      res.send([[{result: 'error'}]]);
    else{
      rows = [rows];
      rows.push([{result: 'correct'}]);
      res.send(rows);
    }
  });
});

app.post('/UpadateProduct', function(req, res) {
  if(con.state === con.Connected){
    connectMYSQL();
    if(!isConnect){
      res.send([[{result: 'failConect'}]]);
      return;
    }
  }
  var request = req.body;
  var sql = "UPDATE productos SET codigo = " + mysql.escape(request.codigo) + ", nombre = " + mysql.escape(request.nombre) + ", cantidad = " + mysql.escape(request.cantidad) + " WHERE codigo = " +  mysql.escape(request.codigoAnt);
  con.query(sql, function (err, rows) {
    if (err)
      res.send([[{result: 'error'}]]);
    else 
      res.send([[{result: 'correct'}]]);
  });
});

app.get('/deleteProduct/:codigo', function(req, res) {
  if(con.state === con.Connected){
    connectMYSQL();
    if(!isConnect){
      res.send([[{result: 'failConect'}]]);
      return;
    }
  }
  var sql = 'DELETE FROM productos WHERE codigo = ' + mysql.escape(req.params.codigo);
  con.query(sql, function (err, result) {
    if (err)
      res.send([[{result: 'error'}]]);
    else
      res.send([[{result: 'correct'}]]);
  });
});

app.post('/InsertProduct', function(req, res) {
  if(con.state === con.Connected){
    connectMYSQL();
    if(!isConnect){
      res.send([[{result: 'failConect'}]]);
      return;
    }
  }

  var request = req.body;
  var sql = "INSERT INTO productos (codigo, nombre, cantidad) VALUES (" + mysql.escape(request.codigo) + ", " + mysql.escape(request.nombre) + ", " + mysql.escape(request.cantidad) + ")";
  con.query(sql, function (err, result) {
    if (err)
      res.send([[{result: 'error'}]]);
    else
      res.send([[{result: 'correct'}]]);
  });
});
  
var  port = process.env.PORT || 8090;
app.listen(port);
console.log('Order API is runnning at ' + port);