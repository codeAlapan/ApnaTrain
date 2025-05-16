const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
     return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    // get the token
    const token = authHeader.split(' ')[1];
    // get the decoded object by jwt verify
    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decoded; //id,role,userName
    next();
  } catch (err) {
     return res.status(401).json({ message: 'Token failed' });
  }
};

module.exports = protect;
