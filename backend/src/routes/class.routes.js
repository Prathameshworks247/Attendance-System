import express from 'express';
import ClassData from '../models/class.model.js';
import {classSchema} from '../validators/schema.js'
import dotenv from 'dotenv';
import roleMiddleware from '../middlewares/roles.middleware.js'
import authMiddleware from '../middlewares/auth.middleware.js';

dotenv.config()

const router = express.Router()

router.post('/',authMiddleware,roleMiddleware("teacher"), async (req,res)=>{
    try {
        const {className} = classSchema.parse(req.body);

        const classData = await ClassData.create({
            className: className,
            teacherId: req.user.userId,
            studentIds:[]
        })
        return res.status(201).json({
            success: true,
            messsage:"class created successfully",
            data: {
                className: classData.className,
                teacherId: classData.teacherId,
                studentIds:classData.studentIds
                }
            })

    } catch (error) {
        if (error.name == "ZodError"){
            res.status(400).json({
                success:false,
                error: "Invalid request schema."
            })
        }
        else{
            res.status(500).json({
                success:false,
                error: "Internal Server Error"
            })
        }
    }
} )


export default router;