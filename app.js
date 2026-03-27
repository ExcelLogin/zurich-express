const express = require('express');
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const globalErrorHandler = require('./Controllers/errorController');

let app = express();

app.use(logger);
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));


app.use('/register', require('./routes/register'));
// app.use('/auth', require('./routes/auth'));
// app.use('/refresh', require('./routes/refresh'));
// app.use('/logout', require('./routes/logout'));






// Fix: use '*' not '*splat' (Express v4)
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        // Use __dirname-relative path — works on Vercel
        const filePath = path.join(__dirname, 'views', '404.html');
        res.sendFile(filePath, (err) => {
            if (err) res.type('txt').send('404 Not Found');
        });
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(globalErrorHandler);

module.exports = app;