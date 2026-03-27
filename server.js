const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

let app;
let isConnected = false;

async function getApp() {
  if (app && isConnected) return app;

  try {
    if (!isConnected) {
      await mongoose.connect(process.env.DATABASE_URI);
      isConnected = true;
      console.log('DB Connection Successful');
    }
    if (!app) {
      app = require('./app');
    }
    return app;
  } catch (err) {
    console.error('Initialization failed:', err);
    throw err;
  }
}

// ✅ Vercel-compatible: export a handler function, not the app directly
module.exports = async (req, res) => {
  try {
    const handler = await getApp();
    handler(req, res);
  } catch (err) {
    res.status(500).json({
      error: 'Server initialization failed',
      message: err.message
    });
  }
};

// ✅ Local dev: still works normally
if (process.env.NODE_ENV !== 'production') {
  getApp().then(appInstance => {
    const port = process.env.PORT || 3000;
    appInstance.listen(port, () => {
      console.log(`Server started on port ${port}...`);
    });
  });
}