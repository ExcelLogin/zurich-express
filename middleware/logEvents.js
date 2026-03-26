// const { format } = require('date-fns');
// const { v4: uuid } = require('uuid');

// const fs = require('fs');
// const fsPromises = require('fs').promises;
// const path = require('path');

// const logEvents = async (message, logName) => {
//     const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
//     const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

//     try {
//         if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
//             await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
//         }

//         await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
//     } catch (err) {
//         console.log(err);
//     }
// }

// const logger = (req, res, next) => {
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
//     console.log(`${req.method} ${req.path}`);
//     next();
// }

// module.exports = { logger, logEvents };


const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const IS_VERCEL = process.env.VERCEL || process.env.NODE_ENV === 'production';

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    // On Vercel: console only (filesystem is read-only)
    if (IS_VERCEL) {
        console.log(`[${logName}] ${logItem.trim()}`);
        return;
    }

    // Locally: write to /logs as before
    try {
        const logsDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logsDir)) {
            await fsPromises.mkdir(logsDir);
        }
        await fsPromises.appendFile(path.join(logsDir, logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };