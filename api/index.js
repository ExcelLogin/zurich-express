try {
    const app = require('../app');
    
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