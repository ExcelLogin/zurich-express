

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');


const app = require('./app');

//console.log(app.get('env'));
// console.log(process.env);

mongoose.connect(process.env.DATABASE_URI, {

}).then((conn) => {
    //console.log(conn);
    console.log('DB Connection Successful');
})

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log('server has started...');
})