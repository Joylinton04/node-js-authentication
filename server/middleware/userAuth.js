import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.VITE_JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    if(decodedToken.id) {
        req.user = decodedToken.id;
    }else{
        return res.json({success: false, message: "Not Authorized"})
    }
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export default authMiddleware;
