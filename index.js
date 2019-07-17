//use path module
const path = require('path');
//use express module
const express = require('express');
const fileUpload = require('express-fileupload');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();
var port = process.env.PORT || 5000;

//Create Connection
const conn = mysql.createConnection({
  host: '192.168.3.18',
  user: 'root',
  password: 'bolacha',
  database: 'data'
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
app.use(fileUpload());

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

//route for insert product
app.post('/produto/save', (req, res) => {
  var file = req.files.product_foto;
  var img_name=file.name;
  console.log(img_name);
  file.mv('./public/fotos/'+img_name, function(err) {
    if (err)
      return res.status(500).send(err);
  });
  let data = {codigo: req.body.product_codigo, produto: req.body.product_produto, descricao: req.body.product_descricao, estoque: req.body.product_estoque, codigo_original: req.body.product_codigo_original, codigo_paralelo: req.body.product_codigo_paralelo, ncm: req.body.product_ncm, preco: req.body.product_preco, promocao: req.body.product_promocao, custo: req.body.product_custo, ultimo_fornecedor: req.body.product_ultimo_fornecedor, foto: img_name};
  let sql = "INSERT INTO produtos SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});


//route for insert client
app.post('/cliente/save',(req, res) => {
  let data = {nome: req.body.product_nome, endereco: req.body.product_endereco, bairro: req.body.product_bairro, cidade: req.body.product_cidade, uf: req.body.product_uf, cpf_cnpj: req.body.product_cpf_cnpj, telefone: req.body.product_telefone};
  let sql = "INSERT INTO clientes SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/clientes');
  });
});

//route for update data
app.post('/produto/update',(req, res) => {
  let sql = "UPDATE produtos SET codigo='"+req.body.product_codigo+"', produto='"+req.body.product_produto+"', descricao='"+req.body.product_descricao+"', estoque='"+req.body.product_estoque+"', codigo_original='"+req.body.product_codigo_original+"', codigo_paralelo='"+req.body.product_codigo_paralelo+"', ncm='"+req.body.product_ncm+"', preco='"+req.body.product_preco+"', promocao='"+req.body.product_promocao+"', custo='"+req.body.product_custo+"', ultimo_fornecedor='"+req.body.product_ultimo_fornecedor+"' WHERE id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for update data
app.post('/cliente/update',(req, res) => {
  let sql = "UPDATE clientes SET nome='"+req.body.product_nome+"', endereco='"+req.body.product_endereco+"', bairro='"+req.body.product_bairro+"', cidade='"+req.body.product_cidade+"', uf='"+req.body.product_uf+"', cpf_cnpj='"+req.body.product_cpf_cnpj+"', telefone='"+req.body.product_telefone+"' WHERE idCliente="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/clientes');
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

//route for delete data
app.post('/cliente/delete',(req, res) => {
  let sql = "DELETE FROM clientes WHERE idCliente="+req.body.product_id+" LIMIT 1";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/clientes');
  });
});

//server listening
app.listen(port, () => {
  console.log('Server is running at port: ' + port);
});
