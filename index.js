//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

//Create Connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bolacha',
  database: 'testedb'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM produtos ORDER BY id DESC LIMIT 100";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});

//route for client
app.get('/clientes',(req, res) => {
  let sql = "SELECT * FROM clientes ORDER BY idCliente";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('clientes',{
      results: results
    });
  });
});

//route search
app.post('/search/',(req, res) => {
  var string = req.body.busca.split(" ");
  var palavra = ("+" + string.join('* +'));
  //console.log(palavra)
  //let data = req.body.busca;
  let sql = "SELECT * FROM produtos WHERE MATCH(codigo,produto,descricao,codigo_original,codigo_paralelo) AGAINST (? IN BOOLEAN MODE) ORDER BY produto,descricao ASC";
  let query = conn.query(sql, palavra,(err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});

//route for insert data
app.post('/save',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO produtos SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE produtos SET produto='"+req.body.product_name+"', preco='"+req.body.product_price+"' WHERE id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM produtos WHERE id="+req.body.product_id+" LIMIT 1";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
