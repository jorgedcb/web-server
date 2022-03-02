 const express = require('express')
 const mysql = require('mysql');

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
  user: 'jorge',
  password: 'castilla74',
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


 
app.listen('3000', () => {
    console.log('server started on port 3000')
});



// var express = require("express");
// var path = require("path");

// var routes = require("./routes");

// var app = express();

// var dgram = require('dgram');
// var port_udp = 5000;
// var  DatosGPS = "Global Variable";

// app.set("port", process.env.PORT || 3000);
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// socket = dgram.createSocket('udp4');

// socket.on('message', function (msg, info){
//     console.log(msg.toString());
    
//     DatosGPS= msg.toString()
//  });
 


// socket.on('listening', function(){
//     var address = socket.address();
//     console.log("listening on :" + address.address + ":" + address.port);
// });

// socket.bind(port_udp);


// var express = require("express");

// var router = express.Router();


// router.get("/", function(req, res) {
//    // console.log("hello I'm on the start page");
// res.render("index",{DatosGPS});
// });

// module.exports = router;
// // app.use(routes);

// app.listen(app.get("port"), function(){
//     console.log("Server started on port " + app.get("port"));
// })

