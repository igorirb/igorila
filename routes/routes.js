// Loading dependencies
var express = require('express');
var router = express.Router();

// Creating instance of database using pooling system
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'gzp0u91edhmxszwf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'llazzxe4m2kth36o',
    password: 'zlz4dlx405lsp6hx',
    database: 'crjlx97gj9ds3jsd',
    port: 3306
});

// Execute query and send results
function executeQuery(sqlQry, res){
  pool.query(sqlQry, function(err, results, fields){
    if (err) throw error;
    if (results.length === 0) res.status(404);
    res.send(results);
  });
}

// Handles GET requests sent to '/'
router.get('/', (req, res) => {
  res.send('Working');
});

// Handles GET requests sent to '/investments'
// Calls 'executeQuery' with SELECT query
router.get('/investments', (req, res) => {
  executeQuery('SELECT * FROM Investments', res);
});

// Handles GET requests sent to '/investments/id'
// Calls 'executeQuery' with SELECT query using ID
router.get('/investments/:id?', (req, res) => {
  let filter = '';
  if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
  executeQuery('SELECT * FROM Investments' + filter, res);
});

// Handles POST requests sent to '/investments'
// Executes INSERT INTO query to add new row on the table
// Calls 'executeQuery' with SELECT to retrieve updated list of investments
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

// Handles DELETE requests sent to '/investments'
// Executes DELETE query to remove a row from the table using specified ID
// Calls 'executeQuery' with SELECT to retrieve updated list of investments
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
