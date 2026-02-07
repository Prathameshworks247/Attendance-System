import mongoose from "mongoose";

import { Schema } from "mongoose";

const ClassSchema  = new Schema({
    className: {
        type: String,
        required: true
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    studentIds: [{
        type: Schema.Types.ObjectId,
        ref : 'UserModel'
    }]
}, {timestamps:true});

export default mongoose.model('Class', ClassSchema);