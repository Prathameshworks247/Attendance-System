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
            message:"class created successfully",
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


router.post('/:id/add-student',authMiddleware,roleMiddleware("teacher"), async (req,res)=>{
    try{
        const classId = req.params.id;
        const {studentId} = req.body;
        const teacherId = req.user.userId;
        const classData = await ClassData.findById(classId);
        if (!classData){
            return res.status(404).json({
                success:false,
                error: "Class not found."
            })
        }
        if (classData.teacherId.toString() !== req.user.userId){
            return res.status(403).json({
                success:false,
                error: "Forbidden, not class teacher"
            })
        }
        if (classData.studentIds.includes(studentId)){
            return res.status(400).json({
                success:false,
                error: "Student already added to the class."
            })
        }
        classData.studentIds.push(studentId);
        await classData.save();
        return res.status(200).json({
            success:true,
            message: "Student added to the class successfully.",
            data: {
                className: classData.className,
                teacherId: classData.teacherId,
                studentIds:classData.studentIds
            }
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            error: "Internal Server Error"
        })
    }
})



export default router;