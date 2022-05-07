const express = require('express');
const mysql = require('mysql');
var dgram = require('dgram');
var port = 5000;
var port_web = 3000;
const path = require('path');
var Times;
var Coordinates;

require('dotenv').config();

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
      console.log('la conexión con la base de datos funciona super bien')
  });

const app = express();
app.use(express.json())

// create table
app.get('/creategpstable', (req, res) => {
  let sql = 'CREATE TABLE gpstable(id int AUTO_INCREMENT, latitud VARCHAR(255), longitud VARCHAR(255), time DATETIME, user VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err,result) =>{
    if(err) throw err;
    console.log(result);
    res.send('my table created....');
  });
});

app.get('/carro1', (req,res) => {
  let sql = "SELECT * FROM gpstable WHERE user='Carro 1' ORDER BY id DESC LIMIT 1";
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    res.send(results[0]);
  });
});

app.get('/carro2', (req,res) => {
  let sql = "SELECT * FROM gpstable WHERE user='Carro 2' ORDER BY id DESC LIMIT 1";
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    res.send(results[0]);
  });
});

app.get('/addcolumn', (req,res) => {
  let sql = 'ALTER TABLE gpstable ADD rpm varchar(255)';
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    res.send(results[0]);
  });
});

app.get('/update', (req,res) => {
  var rpm = 'No info';
  var user = 'Carro 1';
  let sql = "UPDATE gpstable SET rpm = 'No info', user ='Carro 1'";
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    res.send(results[0]);
  });
});

app.get('/additem', (req, res) => {
  datagps = "11.0241-74.8370;02-05-2022 11:11:11".split(";")
  var t = datagps[1].split(' ');
  var d = t[0];
  var day = d.split("-").reverse().join("-");
  var time = day + " " +t[1];
  console.log(time)
  var coordenadas = datagps[0].split('-')
  var user = 'Carro 2';
  let lon = '-';
  let long = lon.concat(coordenadas[1]);
  let post = {latitud:coordenadas[0], longitud:long, time:time, user:user, rpm:'No info'};
  console.log(post)
  let sql = 'INSERT INTO gpstable set ?';
  let query = db.query(sql, post,(err, result) => {
    if(err) throw err;
    console.log(result.affectedRows)
    res.send('Post added')
  })
});

app.get("/", function(req, res) {
res.sendFile(path.join(__dirname, "home.html"));
});


app.get("/historic", function(req, res) {
  res.sendFile(path.join(__dirname, "historic.html"));
  });

socket = dgram.createSocket('udp4');

socket.on('message', function (msg, info){
    datagps = msg.toString().split(';')
    var t = datagps[1].split(' ');
    var d = t[0];
    var day = d.split("-").reverse().join("-");
    var time = day + " " +t[1];
    console.log(time)
    var coordenadas = datagps[0].split('-')
    var user = 'jorge';
    let lon = '-';
    let long = lon.concat(coordenadas[1]);
    let post = {latitud:coordenadas[0], longitud:long, time:time, user:user};
    let sql = 'INSERT INTO gpstable set ?';
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

app.post('/chistoric', function (req, res) {
  console.log("Historics sended")
  console.log(req.body);
  var HisDat = req.body;
  var InitTime = HisDat.datainicio.toString();
  var FinalTime = HisDat.datafin.toString();
  let sql = "SELECT * FROM gpstable WHERE time BETWEEN ('" + InitTime + "') AND ('" + FinalTime + "')";
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    res.send(results);
    Coordinates = results;
  });
});

app.get('/users', function (req, res) {
  let sql = `select user from gpstable group by user `;
  let query = db.query(sql,(err, results) => {
    if(err) throw err;
    res.send({'users': results.map(x => x.user)});
  });
});

app.get('/coordinates', (req,res) => {
  res.send(Coordinates);
});

app.get("/about", function(req, res) {
  res.sendFile(path.join(__dirname, "about.html"));
  });

app.get("/contact", function(req, res) {
  res.sendFile(path.join(__dirname, "contact.html"));
  });
