import mongoose from "mongoose";

import { Schema } from "mongoose";

const ClassSchema  = new Schema({
    className: {
        type: String,
        required: true,
        unique: true
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentIds: [{
        type: Schema.Types.ObjectId,
        ref : 'User'
    }]
}, {timestamps:true});

export default mongoose.model('ClassData', ClassSchema);