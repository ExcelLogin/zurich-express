

// api/index.js
const app = require('../app');
const connectDB = require('../config/dbConn');

// Connect on cold start
connectDB().catch(console.error);

module.exports = app;