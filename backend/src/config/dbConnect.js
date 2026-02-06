import mongoose from 'mongoose';

export default async function dbConnect() {
    try {
        const db = mongoose.connect(process.env.MONGO_URI || "", {})
        console.log("DB Connected Succesfully!!")
    } catch (error) {
        console.log("Error connecting to the DB", error);
        process.exit()
    }    
}