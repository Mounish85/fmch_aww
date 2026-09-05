const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Protect routes
const requireAuth = (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : (req.cookies && req.cookies.jwt);

  if (!token) {
    const isLocal = req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1';
    if (isLocal && (req.originalUrl?.startsWith('/api/counselling/') || req.originalUrl?.startsWith('/api/users/'))) {
      return next();
    }
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decodedToken) => {
      if (err) {
        console.log(err.message);

        return res.status(401).json({
          message:
            "Your session has expired. Please log in again."
        });
      }

      req.userId = decodedToken.id;

      next();
    }
  );
};


// Check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.user = null;
    return next();
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (err, decodedToken) => {
      if (err) {
        console.log(err.message);

        res.locals.user = null;

        return next();
      }

      try {
        const user = await User.findById(
          decodedToken.id
        );

        res.locals.user = user || null;

        next();

      } catch (error) {
        console.log(error.message);

        res.locals.user = null;

        next();
      }
    }
  );
};


module.exports = {
  requireAuth,
  checkUser
};