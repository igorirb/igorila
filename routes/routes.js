var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'gzp0u91edhmxszwf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'llazzxe4m2kth36o',
    password: 'zlz4dlx405lsp6hx',
    database: 'crjlx97gj9ds3jsd',
    port: 3306
});

function executeQuery(sqlQry, res){
  pool.query(sqlQry, function(err, results, fields){
    if (err) throw error;
    if (results.length === 0) res.status(404);
    res.send(results);
  });
}

router.get('/', (req, res) => {
  res.send('Working');
});

router.get('/investments', (req, res) => {
  executeQuery('SELECT * FROM Investments', res);
});

router.get('/investments/:id?', (req, res) => {
  let filter = '';
  if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
  executeQuery('SELECT * FROM Investments' + filter, res);
});

router.post('/investments', (req, res) => {
  let filter = '';
  if(req.body.type && req.body.value && req.body.date) {
    filter = ' VALUES ("' + req.body.type + '",' + req.body.value + ',"' + req.body.date + '")';
    pool.query('INSERT INTO Investments (Type, Value, Date)' + filter, function(err, results, fields){
      if (err) throw error;
      executeQuery('SELECT * FROM Investments', res);
    });
  }
});

router.delete('/investments', (req, res) => {
  let filter = '';
  if(req.body.id) {
    filter = ' WHERE ID=' + parseInt(req.body.id);
    pool.query('DELETE FROM Investments' + filter, function(err, results, fields){
      if (err) throw error;
      executeQuery('SELECT * FROM Investments', res);
    });
  }
});

module.exports = router;
