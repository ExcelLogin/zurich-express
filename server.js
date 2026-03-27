// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' });
// const mongoose = require('mongoose');

// mongoose.connect(process.env.DATABASE_URI)
//   .then(() => {
//     console.log('DB Connection Successful');

//     try {
//       const app = require('./app');

//       if (process.env.NODE_ENV !== 'production') {
//         const port = process.env.PORT || 3000;
//         app.listen(port, () => {
//           console.log(`Server has started on port ${port}...`);
//         });
//       }

//       module.exports = app;
//     } catch (err) {
//       console.error('App failed to load:', err);
//       module.exports = (req, res) => {
//         res.status(500).json({
//           crashed: true,
//           error: err.message,
//           stack: err.stack
//         });
//       };
//     }
//   })
//   .catch((err) => {
//     console.error('DB Connection Failed:', err);
//     process.exit(1);
//   });

const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = require('./app');
const PORT = process.env.PORT || 3000;

// Connect to Database
mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('DB Connection Successful');

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB Connection Failed:', err.message);
    process.exit(1);
  });