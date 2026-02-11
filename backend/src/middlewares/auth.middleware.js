import jwt from "jsonwebtoken";
import { success } from "zod";

const authMiddleware = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || ! authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const token = authHeader.split(" ")[1];
        console.log(process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token!"
        })
    }
};

export default authMiddleware;