// server.js
const mongoose = require('mongoose');

// Load dotenv only in local dev
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({ path: './config.env' });
}

const app = require('./app');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.DATABASE_URI);
  isConnected = true;
  console.log('DB Connection Successful');
}

// Local dev: start a real HTTP server
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  connectDB().then(() => {
    app.listen(port, () => console.log(`Server started on port ${port}...`));
  }).catch(err => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
}

// Vercel: export a handler that connects then delegates to express
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};