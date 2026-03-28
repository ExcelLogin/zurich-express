const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const globalErrorHandler = require('./Controllers/errorController');
const corsOptions = require('./config/corsOptions');
let app = express();







app.use(logger);


// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());
//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));





app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));
app.use('/userData', require('./routes/api/userData'))
app.use('/Admin', require('./routes/api/Admin'))





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