const jwt = require("jsonwebtoken");

  const config = process.env;
  const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-auth-token"];

  if (!token) {
    return res.status(403).json({
      success: "false",
      message: "Token is required",
      error: {
        statusCode: 403,
        message: "A token is required for authentication",
      },
    });
  }
  
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      success: "false",
      message: "Token is invalid",
      error: {
        statusCode: 403,
        message: "Token provided in header is invalid",
      },
    });
  }
  return next();
};

module.exports = verifyToken;