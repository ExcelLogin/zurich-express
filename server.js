const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connect to Database only if not already connected
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('DB Connection Successful');
  }
};

connectDB().catch((err) => {
  console.error('DB Connection Failed:', err.message);
});

// Export app for Vercel (no app.listen needed)
module.exports = app;