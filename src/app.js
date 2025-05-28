const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(bodyParser.json());

// Route for /identify endpoint
app.use('/identify', contactRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Bitespeed Identity Reconciliation API');
});

module.exports = app;
