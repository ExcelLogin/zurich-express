
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');




mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch((err) => {
    console.error('DB Connection Failed:', err);
  });




try {
    const app = require('./app');
    
    if (process.env.NODE_ENV !== 'production') {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log('server has started...');
        });
    }
    
    module.exports = app;
} catch (err) {
    module.exports = (req, res) => {
        res.status(500).json({
            crashed: true,
            error: err.message,
            stack: err.stack
        });
    };
}