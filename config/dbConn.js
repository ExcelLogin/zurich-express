

const mongoose = require('mongoose');

const connectDB = async () => {
    // If already connected, reuse connection
    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB reusing existing connection');
        return;
    }

    // If connecting, wait for it
    if (mongoose.connection.readyState === 2) {
        await new Promise((resolve) => mongoose.connection.once('connected', resolve));
        return;
    }

    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 1,
            retryWrites: true,
            retryReads: true,
        });

        console.log('MongoDB connected');

        // Handle connection drops
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected — will reconnect on next request');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            mongoose.connection.close();
        });

    } catch (err) {
        console.error('MongoDB connection failed:', err);
        throw err;
    }
};

module.exports = connectDB;












// const mongoose = require('mongoose');

// let isConnected = false;

// const connectDB = async () => {
//     if (isConnected) return; // reuse existing connection

//     try {
//         const db = await mongoose.connect(process.env.DATABASE_URI, {
//             serverSelectionTimeoutMS: 10000,
//             socketTimeoutMS: 45000,
//         });

//         isConnected = db.connections[0].readyState === 1;
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//         throw err;
//     }
// };

// module.exports = connectDB;


// const mongoose = require('mongoose');

// let isConnected = false;

// const connectDB = async () => {
//     if (isConnected) return; // reuse existing connection

//     try {
//         const conn = await mongoose.connect(process.env.DATABASE_URI, {
//             serverSelectionTimeoutMS: 10000,
//             socketTimeoutMS: 45000,
//         });

//         isConnected = true;
//         console.log(`MongoDB connected: ${conn.connection.host}`);
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//         throw err;
//     }
// };

// module.exports = connectDB;