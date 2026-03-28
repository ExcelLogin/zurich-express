

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return; // reuse existing connection

    try {
        const db = await mongoose.connect(process.env.DATABASE_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

module.exports = connectDB;