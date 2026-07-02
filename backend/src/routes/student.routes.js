import express from 'express';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import roleMiddleware from '../middlewares/roles.middleware.js'
import authMiddleware from '../middlewares/auth.middleware.js';
dotenv.config()

const router = express.Router()

router.get('/', authMiddleware, roleMiddleware('teacher'), async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('_id name email');
        return res.status(200).json({
            success: true,
            data: students
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
})

export default router;