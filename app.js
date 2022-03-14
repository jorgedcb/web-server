const express = require('express')
 const mysql = require('mysql');
 var dgram = require('dgram');
var port = 5000;
const path = require('path')
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
  //password: entvar.parsed.DB_PASS,
  host: 'diseno.cr8cosserlpi.us-east-1.rds.amazonaws.com',
  user: 'jorge',
  //user: 'jorge',
  password: 'castilla74',
  //password: 'castilla74',
  database: 'diseno'
  
});

db.connect((err) => {
    if (err) {
        throw err
    }
      console.log('la conexión con la base de datos funciona')
  });

const app = express();
app.use(express.json())
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
    res.send('my table created...');
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

app.get('/home', (req,res) => {
  let sql = 'SELECT * FROM mytable ORDER BY id DESC LIMIT 1';
  let query = db.query(sql,(err, results) =>{
    if(err) throw err;
    //console.log(results);
    res.send(results[0]);
  });
});

app.get("/", function(req, res) {
  // console.log("hello I'm on the start page");
res.sendFile(path.join(__dirname, "home.html"));
});

socket = dgram.createSocket('udp4');

socket.on('message', function (msg, info){
    datagps = msg.toString().split(';')
    console.log(datagps);
    var time = datagps[1].split(' ')
    var coordenadas = datagps[0].split('-')
    let post = {latitud:coordenadas[0], longitud:coordenadas[1], fecha:time[0], hora:time[1]};
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

// Include Nodejs' net module.
const Net = require('net');
// The port on which the server is listening.
const port_tcp = 6000;

// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
const server = new Net.Server();
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port_tcp, function() {
    console.log(`Server listening for connection requests on socket localhost:${port_tcp}`);
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket) {
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    socket.write('Hello, client.');

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk) {
        //console.log('Data received from client: ${chunk.toString()}');
        //console.log('Data received from client:'+chunk.toString());

        datagps = chunk.toString().split(';')
        console.log(datagps);
        var time = datagps[1].split(' ')
        var coordenadas = datagps[0].split('-')
        let post = {latitud:coordenadas[0], longitud:'-'+coordenadas[1], fecha:time[0], hora:time[1]};
        let sql = 'INSERT INTO mytable set ?';
        let query = db.query(sql, post,(err, result) => {
          if(err) throw err;
          console.log("mensaje insetado")
        })  
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    // Don't forget to catch error, for your own sake.
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});

app.listen('3000', () => {
    console.log('server started on port 3000')
});
