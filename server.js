const express = require('express');
const bodyParser = require('body-parser');
const indexRoute = require('./routes/routes.js');

// Instantiate express
const app = express();

// Set our port
const port = process.env.PORT || 5000;

// Configure app tu use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register our routes in api
app.use('/api', indexRoute);

// Start our server
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
