import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    // Get token stored in cookies
    const token = req.cookies.token
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized- No token provided" });

    try {
        // Decode token by checking if it contains the JWT Secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) return res.status(401).json({success: false, message: "Unauthorized - Invalid token"})
        
        // set user id to the id decoded from the token
        req.userId = decoded.userId;
        
        next();    
    } catch (error) {
        console.log("Error in verifying token", error);
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
    }


}