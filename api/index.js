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


// const app = require('../app'); // your Express app
// module.exports = app;




// api/index.js
const app = require('../app');
const connectDB = require('../config/dbConn');

// Connect on cold start
connectDB().catch(console.error);

module.exports = app;