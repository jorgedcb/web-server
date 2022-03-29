const express = require('express')
 const mysql = require('mysql');
var dgram = require('dgram');
var port = 5000;
var port_web = 3000;
const path = require('path')

require('dotenv').config();

var data;
var db = mysql.createConnection({
  user: process.env.USER_DB,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DB
});

db.connect((err) => {
    if (err) {
        throw err
    }
      console.log('la conexión con la base de datos funciona')
  });

const app = express();
app.use(express.json())

// create table
app.get('/creategpstable', (req, res) => {
  let sql = 'CREATE TABLE mytable(id int AUTO_INCREMENT, latitud VARCHAR(255), longitud VARCHAR(255), fecha VARCHAR(255), hora VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err,result) =>{
    if(err) throw err;
    console.log(result);
    res.send('my table created...');
  });
});

app.get('/home', (req,res) => {
  let sql = 'SELECT * FROM mytable ORDER BY id DESC LIMIT 1';
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    res.send(results[0]);
  });
});

app.get("/", function(req, res) {
res.sendFile(path.join(__dirname, "home.html"));
});

socket = dgram.createSocket('udp4');

socket.on('message', function (msg, info){
    datagps = msg.toString().split(';')
    console.log(datagps);
    var time = datagps[1].split(' ')
    var coordenadas = datagps[0].split('-')
    let lon = '-';
    let long = lon.concat(coordenadas[1]);
    let post = {latitud:coordenadas[0], longitud:long, fecha:time[0], hora:time[1]};
    let sql = 'INSERT INTO mytable set ?';
    let query = db.query(sql, post,(err, result) => {
      if(err) throw err;
      console.log("mesage insetado")
    })
  });

socket.on('listening', function(){
    var address = socket.address();
    console.log("listening on :" + address.address + ":" + address.port);
});

socket.bind(port);

app.listen(port_web, ()=> {
  console.log(`Demo app is up and listening to port: ${port_web}`);
})
