
import jwt from 'jsonwebtoken'

/**
 * JWT token verifier middleware
 * @param {Request} req 
 * @param {Response} res
 * @param {()=>void} next
 */
export const verifyJWT = (req, res, next) => {
  const token = req.headers.get("authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.user = data;
    next();
  });
}

export default verifyJWT