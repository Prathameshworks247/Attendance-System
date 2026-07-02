import express from 'express';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import roleMiddleware from '../middlewares/roles.middleware.js'
import authMiddleware from '../middlewares/auth.middleware.js';
dotenv.config()

const router = express.Router()