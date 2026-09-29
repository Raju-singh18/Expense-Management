
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) =>{
    try {
        const header = req.headers.authorization;

        if(!header || !header.startsWith("Bearer ")){
          return res.status(401).json({
            success:false,
            message:"Authorization token is required."
          });
        }

        const token = header.split(" ")[1];

        const decode = jwt.verify(token,
            process.env.JWT_SECRET
        );

        req.user = decode;

        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        })
    }
}

module.exports = auth;
