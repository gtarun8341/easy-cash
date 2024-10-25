// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  // Log the token retrieved from the request header
  console.log('Authorization Header:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const formattedToken = token.replace('Bearer ', ''); // Remove 'Bearer ' prefix if present
    console.log('Formatted Token:', formattedToken); // Log the formatted token
    
    const decoded = jwt.verify(formattedToken, process.env.JWT_SECRET);
    
    // Log the decoded token payload
    console.log('Decoded Token:', decoded);

    req.user = decoded;
    next();
  } catch (err) {
    // Log the error if token verification fails
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
