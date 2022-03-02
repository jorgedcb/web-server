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

app.get('/addpost1', (req, res) => {
  let post = {title:'Post One', body:'This is post number one'};
  let sql = 'INSERT INTO posts set ?';
  let query = db.query(sql, post,(err, result) => {
    if(err) throw err;
    console.log(result)
    res.send('Post added')
  })
});

app.get('/getposts', (req,res) => {
  let sql = 'SELECT * FROM posts';
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    console.log(results);
    res.send(results);
  });
});

socket = dgram.createSocket('udp4');

socket.on('message', function (msg, info){
    datagps = msg.toString()
    console.log(datagps);
    let post = {title:'Post One', body:datagps};
    let sql = 'INSERT INTO posts set ?';
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
