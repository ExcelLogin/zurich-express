const User = require('../model/User');


const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    
    const refreshToken = cookies.jwt;

    // Atomic update - removes token in one operation
    const result = await User.findOneAndUpdate(
        { refreshToken: refreshToken },
        { $pull: { refreshToken: refreshToken } },
        { new: true }
    ).exec();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
};





module.exports = { handleLogout };
