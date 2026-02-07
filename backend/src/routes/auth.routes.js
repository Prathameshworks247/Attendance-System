import express from 'express';
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser';

const router  = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || ''

router.get('/login', (req,res)=>{
    const {username, password} = req.body;
    const user = user.find(u=> u.username === username && u.password === password)
    if (!user){
        return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
    }

    const payload = {
        id : user.id,
        username : user.username,
        role : user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '4h'});

    return new Response(JSON.stringify({ success: true, message: "User authenticated succesfully!!!" }), { status: 201 });
})
router.get('/signup', (req,res)=>{
    res.send("Login Please")
})


export default router;