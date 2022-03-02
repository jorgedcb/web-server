const express = require('express')
 const mysql = require('mysql');
 var dgram = require('dgram');
var port = 5000;

//  //Variables de entorno
// dotenv = require('dotenv')
// const entvar = dotenv.config()

// if (entvar.error) {
//   throw entvar.error
// }
// console.log(entvar.parsed)
//Conexión Base de datos
var data;
var db = mysql.createConnection({
  // host: entvar.parsed.DB_HOST,
  // user: entvar.parsed.DB_USER,
  // password: entvar.parsed.DB_PASS,
  host: 'localhost',
  user: 'sammy',
  password: 'password',
//password: 'castilla74',
  database: 'nodemysql'
  
});

db.connect((err) => {
    if (err) {
        throw err
    }
      console.log('la conexión con la base de datos funciona')
  });

const app = express();

//create database
app.get('/createdb',(req,res) =>{
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if(err) throw error;
        console.log(result)
        res.send('Database created ...')
    });
});

// create table
app.get('/createpoststable', (req, res) => {
  let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err,result) =>{
    if(err) throw err;
    console.log(result);
    res.send('Posts table created...');
  });
});

// create table
app.get('/creategpstable', (req, res) => {
  // let sql = 'CREATE TABLE mytable(id int AUTO_INCREMENT, latitud VARCHAR(255), longitud VARCHAR(255), fecha DATE, hora TIME, PRIMARY KEY(id))';
  let sql = 'CREATE TABLE mytable(id int AUTO_INCREMENT, latitud VARCHAR(255), longitud VARCHAR(255), fecha VARCHAR(255), hora VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err,result) =>{
    if(err) throw err;
    console.log(result);
    res.send('mytable created...');
  });
});

app.get('/addpost1', (req, res) => {
  let post = {title:'Post One', body:'This is post number one'};
  let sql = 'INSERT INTO posts set ?';
  let query = db.query(sql, post,(err, result) => {
    if(err) throw err;
    console.log(result)
    res.send('Post added')
  })
});

app.get('/additem', (req, res) => {
  datagps = "10.981133-74.8378764;02-03-2022 10:42:23".split(";")
  var time = datagps[1].split(' ')
  var coordenadas = datagps[0].split('-')
  let post = {latitud:coordenadas[0], longitud:coordenadas[1], fecha:time[0], hora:time[1]};
  let sql = 'INSERT INTO mytable set ?';
  let query = db.query(sql, post,(err, result) => {
    if(err) throw err;
    console.log(result)
    res.send('Post added')
  })
});

app.get('/getposts', (req,res) => {
  let sql = 'SELECT * FROM posts ORDER BY id DESC LIMIT 1';
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get('/', (req,res) => {
  let sql = 'SELECT * FROM mytable ORDER BY id DESC LIMIT 1';
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    console.log(results);
  });
});

socket = dgram.createSocket('udp4');

socket.on('message', function (msg, info){
    datagps = msg.toString()
    console.log(datagps);
    var time = datagps[1].split(' ')
    var coordenadas = datagps[0].split('-')
    let post = {latitud:coordenadas[0], longitud:coordenadas[1], fecha:time[0], hora:time[1]};
    let sql = 'INSERT INTO mytable set ?';
    let query = db.query(sql, post,(err, result) => {
      if(err) throw err;
      console.log(result)
    })
  });

socket.on('listening', function(){
    var address = socket.address();
    console.log("listening on :" + address.address + ":" + address.port);
});

socket.bind(port);


 
app.listen('3000', () => {
    console.log('server started on port 3000')
});
