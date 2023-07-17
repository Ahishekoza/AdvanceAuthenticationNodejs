import express from 'express';
const router =  express.Router();
import { generateOTP, getUser, login, register, resetPassword, updateUser, verifyOTP, verifyUser } from '../controllers/userController.js';
import { Auth, localVariables } from '../middleware/auth.js';
import { registerMail } from '../controllers/mailController.js';

// --- Post Requests --------------------------------
router.post('/register',register)
router.post('/login',login)
router.post('/registerMail',registerMail)

// ----Get Requests --------------------------------
router.get('/user/:username',getUser)
router.get('/generateOTP',verifyUser,localVariables,generateOTP) // generate random OTP
router.get('/verifyOTP',verifyUser,verifyOTP)


// ----Put Requests --------------------------------
router.put('/updateUser',Auth,updateUser)
router.put('/resetpassword',verifyUser,resetPassword)

export default router