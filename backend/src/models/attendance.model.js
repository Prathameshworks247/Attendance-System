import mongoose from "mongoose";

import { Schema } from "mongoose";

const AttendanceSchema  = new Schema({

    classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref : 'User'
    },
    status: {
        type: String,
        enum: ['present', 'absent']
    }
}, {timestamps:true});

export default mongoose.model('Attendance', AttendanceSchema);