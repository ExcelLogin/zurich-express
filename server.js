

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
 })


connectDB();

// console.log(process.env);

const app = require('./app');


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});


const server = app.listen(PORT, () => {
    console.log('server has started...');
})


process.on('unhandledRejection', (err) => {
   console.log(err.name, err.message,err.stack);
   console.log('Unhandled rejection occured! Shutting down...');

   server.close(() => {
    process.exit(1);
   })
})