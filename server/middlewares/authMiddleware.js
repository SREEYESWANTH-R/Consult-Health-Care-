const jwt = require('jsonwebtoken');
const db = require('../config/db');


const verifyToken = async (req,res,next)=>{
    //req token from cookies of the user
    const token = req.cookies.accessToken;
    //check if token is provided
    if(!token) return res.status(401).json({success:'false',message:'Session ended, login again'});
    //verify the token to get the user id
    try {
      // Verify the token to get the user id
      const decoded = jwt.verify(token, process.env.MY_PRIVATE_KEY);
      req.userId = decoded.Id;
      next(); // Pass control to the next middleware
    } catch (err) {
      // If the token is expired or invalid, update the user's active state to 0 (inactive)
      const userId = jwt.decode(token)?.Id; // Decode the token to get the user id
      if (userId) {
        const updateQuery = "UPDATE signup SET active = 0 WHERE id = ?";
        db.query(updateQuery, [userId], (error) => {
          if (error) {
            console.error('Error updating user active status:', error);
          }
        });
      }
      // Clear the token cookie and redirect the user to the login page
      res.clearCookie('accessToken');
      return res.status(401).json({ success: false, message: 'Session ended, login again' });
    }
  };

  module.exports = verifyToken;