const express = require('express');
const bodyParser = require('body-parser');
const indexRoute = require('../routes/routes.js');
const path = require('path');

// Set our port
const port = process.env.PORT || 5000;

// Instantiate express
const app = express();

// Configuring express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../build')));

// Production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/../build')));
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../public/index.html'));
  });
}

// Registering routes
app.use('/api', indexRoute);

// Start our server
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
