
// const mongoose = require('mongoose');
const app = require('./app');

// console.log(process.env);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server has started...');
})
