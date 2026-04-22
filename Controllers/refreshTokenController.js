const User = require('../model/User');
const jwt = require('jsonwebtoken');


//real code starts here

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    // If token not found in DB
    if (!foundUser) {
        return jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                return res.sendStatus(403);
            }
        );
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    return jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {

            if (err) {
                // expired or invalid token
                foundUser.refreshToken = newRefreshTokenArray;
                await foundUser.save({ validateBeforeSave:false });
                return res.sendStatus(403);
            }

            if (foundUser.email !== decoded.email) return res.sendStatus(403);

            // issue new tokens
            const roles = Object.values(foundUser.roles);

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "_id": foundUser._id,
                        "email": foundUser.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            const newRefreshToken = jwt.sign(
                {
                    "email": foundUser.email,
                    "_id": foundUser._id
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save({ validateBeforeSave:false });

            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                 domain: '.westernzurich.online',
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.json({ accessToken });
        }
    );
};


















module.exports = { handleRefreshToken }