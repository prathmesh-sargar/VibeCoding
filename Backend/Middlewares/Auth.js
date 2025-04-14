import { getUser } from "../Services/Auth.js";

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Please login" });

    const user = getUser(token);
    if (!user) return res.status(403).json({ msg: "Invalid token" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Authentication error" });
  }
};

export{authenticateToken} ;
