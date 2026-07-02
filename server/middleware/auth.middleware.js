import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    // 2. Check if token exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // 3. Extract token — YOUR TURN, how do you get just the token part?
    const token = authHeader.split(' ')[1];

    // 4. Verify token — YOUR TURN, use jwt.verify()
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    // 5. Find user by id from decoded token — YOUR TURN
    const user = await User.findById(decoded.id)

    // 6. Attach user to request
    req.user = user;

    // 7. Continue to controller
    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
export const restrictTo = (...roles) => {
  // roles = ['admin'] or ['admin', 'seller'] — whatever you passed in

  return (req, res, next) => {
    // this inner function IS the middleware
    // req.user is already here from protect

    if (!roles.includes(req.user.role)) {
      // user's role is NOT in the allowed roles
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }

    // role is allowed → continue
    next();
  };
};