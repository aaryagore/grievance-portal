const express = require('express');
const backendApp = require('../mail-backend/server.js');

const app = express();
app.use('/api', backendApp);
app.use('/', backendApp);

module.exports = app;
