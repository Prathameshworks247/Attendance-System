import mongoose from "mongoose";

const {Schema} = mongoose;

const UserSchema = new Schema({
    
    name : {
        type: String,
        required: true,
        unique: [true, "username already in use"]
    },
    email : {
        type: String,
        required: true,
        unique: [true, "Email already in use"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
    },
    role:{
        type: String,
        enum: ['student', 'teacher'],
        required: true
    }
})


const UserModel = mongoose.model('User', UserSchema)

export default UserModel;