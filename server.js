

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;


connectDB();



const app = require('./app');



// mongoose.connect(process.env.DATABASE_URI, {

// }).then((conn) => {
//     //console.log(conn);
//     console.log('DB Connection Successful');
// })

// const port = process.env.PORT || 3000;



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});




const server = app.listen(PORT, () => {
    console.log('server has started...');
})