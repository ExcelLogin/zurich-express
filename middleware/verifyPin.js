// const User = require('../model/User');


// const verifyPin = async (req, res, next) => {
//   const { pin } = req.body;
//   if (!pin) return res.status(400).json({ message: 'PIN is required.' });
//   const user = await User.findOne({"_id":req._id }).select('+pin');
//   if (!user) return res.status(404).json({ message: 'User not found.' });
//   if (Number(pin) !== user.pin) return res.status(401).json({ message: 'Incorrect PIN.' });
//   next();
// };


// module.exports = verifyPin;