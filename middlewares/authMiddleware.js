const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Check if the request has a wristband in the "Authorization" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Grab the wristband (It usually looks like "Bearer eyJhbGciOi...")
      // We split the string by the space and take the second part (the actual token)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the wristband using our secret company seal
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the user's ID to the request. 
      // Now, any function that runs after this will know EXACTLY who is logged in.
      req.user = { id: decoded.userId };

      // 5. Open the door and let them through to the next function!
      next();
      
    } catch (error) {
      console.error('Wristband check failed:', error.message);
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  // 6. If they didn't even bring a wristband
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };