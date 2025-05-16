const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Access Denied: Unauthorized role' });
    }
    next();
  };
};

module.exports = authorizedRoles;