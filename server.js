
// const mongoose = require('mongoose');
// const app = require('./app');

// console.log(process.env);

// const port = process.env.PORT || 3000;




// const app = require('./app');

// // Only listen when running locally, not on Vercel
// if (process.env.NODE_ENV !== 'production') {
//     const port = process.env.PORT || 3000;
//     app.listen(port, () => {
//         console.log('server has started...');
//     });
// }

// module.exports = app;

// app.listen(port, () => {
//     console.log('server has started...');
// })


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