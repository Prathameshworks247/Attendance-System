import express from "express";
const app = express();

//globla middlewares

app.use(express.json()); //parse json body 
app.use(cors());


export default app;