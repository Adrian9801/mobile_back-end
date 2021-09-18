var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var mysql = require('mysql');


var db_config = {
  host: "mysql5046.site4now.net",
  user: "a79446_mobile",
  password: "admin123",
  database: "db_a79446_mobile"
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors()); // {origin :'http://localhost:8090'}


app.get('/Products', function(req, res) {
  var sql = 'SELECT * FROM productos';
  connection.query(sql, function (err, rows) {
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
  var request = req.body;
  var sql = "UPDATE productos SET codigo = " + mysql.escape(request.codigo) + ", nombre = " + mysql.escape(request.nombre) + ", cantidad = " + mysql.escape(request.cantidad) + " WHERE codigo = " +  mysql.escape(request.codigoAnt);
  connection.query(sql, function (err, rows) {
    if (err)
      res.send([[{result: 'error'}]]);
    else 
      res.send([[{result: 'correct'}]]);
  });
});

app.get('/deleteProduct/:codigo', function(req, res) {
  var sql = 'DELETE FROM productos WHERE codigo = ' + mysql.escape(req.params.codigo);
  connection.query(sql, function (err, result) {
    if (err)
      res.send([[{result: 'error'}]]);
    else
      res.send([[{result: 'correct'}]]);
  });
});

app.post('/InsertProduct', function(req, res) {
  var request = req.body;
  var sql = "INSERT INTO productos (codigo, nombre, cantidad) VALUES (" + mysql.escape(request.codigo) + ", " + mysql.escape(request.nombre) + ", " + mysql.escape(request.cantidad) + ")";
  connection.query(sql, function (err, result) {
    if (err)
      res.send([[{result: 'error'}]]);
    else
      res.send([[{result: 'correct'}]]);
  });
});
  
var  port = process.env.PORT || 8090;
app.listen(port);
console.log('Order API is runnning at ' + port);