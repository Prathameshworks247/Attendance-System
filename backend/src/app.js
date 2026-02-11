import express from "express";
import cors from "express";
const app = express();

//globla middlewares

app.use(cors());
app.use(express.json()); //parse json body 


export default app;