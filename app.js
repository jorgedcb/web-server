const express = require('express');
const mysql = require('mysql');
var dgram = require('dgram');
var port = 5000;
var port_web = 3000;
const path = require('path');
var Coordinates;
const cookieParser = require('cookie-parser');

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
app.use(cookieParser());
app.use(express.json())

app.use(express.static(__dirname + '/public')); // para que se pueda acceder a los archivos estaticos



app.get('/additem', (req, res) => {
  datagps = "11.0241-74.8370;02-05-2022 11:11:11;5000;Carro 2".split(";")
  var t = datagps[1].split(' ');
    var d = t[0];
    var day = d.split("-").reverse().join("-");
    var time = day + " " +t[1];
    console.log(time)
    var coordenadas = datagps[0].split('-')
    var user = datagps[3]
    var rpm = datagps[2]
    let lon = '-';
    let long = lon.concat(coordenadas[1]);
    let post = {latitud:coordenadas[0], longitud:long, time:time, user:user, rpm:rpm};
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
    var user = datagps[3]
    var rpm = datagps[2]
    let lon = '-';
    let long = lon.concat(coordenadas[1]);
    let post = {latitud:coordenadas[0], longitud:long, time:time, user:user, rpm:rpm};
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

app.get('/realtime', (req,res) => {
  db.query(`SELECT Placa FROM placas`, async function(err, results) {
    if(err) {
      res.send({status: 0, message: err})
    }else {
      var finalArray = new Array();

      for(var placa of results) {
        try {
          const data = await getByPlaca(placa.Placa);
          if(data) {
            finalArray.push(data)
          }
        }catch(error) {
          res.send({status: 0, message: error});
        }
      }
      console.log(finalArray);
      res.send({status: 1, data:finalArray});
    }
  });
});

app.get('/admin', verify_session, function(req, res) {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.post('/admin', verify_session, function(req, res) {
  const placa = req.query.placa;
  db.query(`SELECT Placa FROM placas WHERE Placa = '${placa}'`, function(err, results) {
    if (err) {
      console.log(err);
      res.send({status: 0, message: err});
    }else {
      if(results.length > 0) {
        res.send({status: 0, message: "Esta placa existe..."});
      }else {
        db.query(`INSERT INTO placas (Placa) VALUES ('${placa}')`, function(err) {
          if(err) {
            console.log(err);
            res.send({status: 0, message: err});
          }else {
            res.send({status: 1});
          }
        });
      }
    }
  });
})

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post('/login', function(req, resp) {
  const username = req.query.username;
  const pass = req.query.password;

  console.log(username);
  db.query(`SELECT * FROM users WHERE Username = '${username}'`, function(error, data){
      if(error){
          console.log(error);
          resp.status(500).send("Error logining. Please try later...");
      }else{
          if(data.length > 0){
              const hash = data[0].Pass;
              if(pass == hash){
                  create_session(Number(data[0].Id)).then(function(resolved){
                      resp.cookie('session_id', resolved.token, {maxAge: 1200*1000}).send({status: 1});
                  }, function(rejected){
                      console.log(rejected);
                      resp.status(500).send({status: 0, message: "Error creating session..."});
                  });
              }else{
                  resp.status(200).send({status: 0, message: "Incorrect password..."});
              }
          }else{
              resp.send({status: 0, message: "User not found..."});
          }
      }
  });
});

app.get('/logout', verify_session, function(req, resp) {
  const user_id = req.user_id;
  db.query(`DELETE FROM sessions WHERE user_id = ${user_id}`, function(error){
      if(error) {
          console.log(error);
          resp.status(404).send();
      }else{
          resp.status(200).send({status: 1});
      }
  });
});

app.get('/', function(req, resp) {
  resp.render('home');
});


function getByPlaca(placa) {
  return (
    new Promise(function(resolve, reject) {
      db.query(`SELECT * FROM gpstable WHERE user = '${placa}' ORDER BY id DESC LIMIT 1;`, function(err, results) {
        if(err) {
          reject(err);
        }else {
          resolve(results[0]);
        }
      })
    })
  )
}

async function verify_session(req, resp, next){
  const cookie = req.cookies['session_id'];
  console.log(cookie);
  const resolved = await get_session(cookie).catch(function(rejected) {
      console.log(rejected);
  });

  if(resolved) {
      req.user_id = resolved.User_id;
      req.username = resolved.Username;
      next();
  }else{
      resp.redirect('/login');
  }
}

async function get_session(cookie){
  return(
      new Promise(function(resolve, reject){
          db.query(`SELECT * FROM sessions 
          INNER JOIN users ON sessions.User_id = users.Id AND sessions.session = '${cookie}'`, function(error, data){
              if(error){
                  reject(error);
              }else{
                  if(data.length > 0){
                      resolve(data[0]);
                  }else{
                      reject("Session not found...");
                  }
              }
          });
      })
  )
}

async function create_session(user){
  return(new Promise(async function(resolve, reject){
      var id;
      if(typeof user == "string"){
          id = await get_user_id(user)
      }else{
          id = user;
      }

      if(typeof id != "number"){
          reject({status: 0, message: "Error creating session..."});
      }else{
          const token = create_token(30);
          db.query(`INSERT INTO sessions (User_id, Session) VALUES ('${id}', '${token}')`, function(error){
              if(error){
                  console.log(error);
                  reject({status: 0, message: "Error creating session..."});
              }else{
                  resolve({status: 1, token: token})
              }
          });
      }
  }));
}

function create_token(tam){
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = upper.toLowerCase();
  const number = "0123456789";
  const total = upper + lower + number;
  var token = "";

  for(var i=0; i<tam; i++){
      token += total[Math.floor(Math.random()*(total.length - 1))];
  }

  return token;
}