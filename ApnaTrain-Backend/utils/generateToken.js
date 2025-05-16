const jwt = require('jsonwebtoken');

const genarateToken = (user) => {
  return jwt.sign(
    { _id: user.id,
      role: user.role,
      userName: user.userName 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};
module.exports = genarateToken;
