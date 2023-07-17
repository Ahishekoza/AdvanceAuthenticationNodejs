import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt_token from 'jsonwebtoken'
import dotenv from 'dotenv'
import otpGenerator from 'otp-generator'
import { localVariables } from "../middleware/auth.js";
dotenv.config()

function jwtToken(user) {
    const payload =  { _id: user._id,username: user.username, password: user.password}
    const secret_key = process.env.SECRET_KEY
    const options = { expiresIn : '1d'} 
    const token =  jwt_token.sign(payload, secret_key, options)
    return token 
}



export const verifyUser = async(req, res, next) => {

    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await userModel.findOne({ username: username});
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


export const register = async(req,res)=>{
    const {username,password,profile,email} = req.body;
    
    // --check user existance
    const existingUser = await userModel.findOne({username:username})
    if(existingUser){
        return res.status(404).json({
            message: "User already exists",
            user: existingUser
        })
    }

    const hashPassword = await bcrypt.hash(password,10)

    await userModel.create({username:username,password:hashPassword,profile:profile,email:email}).then((resposne)=>{
        return res.status(200).json({
            success: true,
            message:"User Registered successfully",
            user:resposne,
        })
    }).catch((err)=>{
        return res.status(404).json({
            success: false,
            message:`User registration failed ${err}`
        })
    })

}

export const login = async(req,res)=>{

    const {username,password} = req.body

    await userModel.findOne({username: username}).then((response)=>{
        bcrypt.compare(password, response.password,async(err,user)=>{
            if(err){
                return res.status(401).json({
                    message: 'Invalid password'
                })
            }

        

            else{
                    // ---Generate a JWT Token
            console.log(response)
                return  res.status(200).json({
                    success: true,
                    message: " User Loginned successfully",
                    token : jwtToken(response)
                })
            }

        })
    }).catch((err)=>{
        return res.status(404).json({
            success: false,
            message: 'User Not Found'
        })
    })


}

export const getUser = async(req, res) =>{

    const {username} = req.params

    await userModel.findOne({username: username}).then((user) =>{

        const { password , ...reset} =  Object.assign({}, user.toJSON())

        return res.status(200).json({
            success: true,
            user:reset,
        })
    }).catch((error) =>{
        return res.status(500).json({
            success: false,
            message: "User Not Found"
        })
    })

}

export const updateUser = async(req, res) => {
    
    const {_id} = req.user


    await userModel.findByIdAndUpdate({_id:_id},req.body).then((user) =>{
     return res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        user: user
     })

    }).catch((error) =>{
        return res.status(500).json({
            success: false,
            message: `Unable to update user ${error.message}`
        })
    })

}

export const generateOTP = async(req,res)=>{

    req.app.locals.OTP = await otpGenerator.generate(6,{lowerCaseAlphabets:false, upperCaseAlphabets:false,specialChars:false})
    return res.status(200).json({
        code: req.app.locals.OTP
    })

}

export const verifyOTP = async(req,res)=>{

    const { code } =  req.query

    if(parseInt(code) === parseInt(req.app.locals.OTP)){
        req.app.locals.OTP = null,
        req.app.locals.resetsession = true
        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        })
    }

    else{
        return res.status(400).json({
            message: 'Invalid OTP code'
        })
    }



}

export const resetPassword = async(req,res)=>{

    const {username,password} = req.body
    
    if(req.app.locals.resetsession){
        await userModel.findOne({username: username}).then((user)=>{
            bcrypt.hash(password,10).then(async(hashpassword)=>{
                await userModel.updateOne({username: username,password: hashpassword})
                    .then((response)=>{
                        return res.status(200).json({
                            message:'Record updated successfully'
                        })
                    }).catch((error)=>{
                        return res.status(401).json({
                            message:'Unable to update Record '
                        })
                    })
            }).catch((error)=>{
                return res.status(401).json({
                    message: 'Unable to reset password'
                })
            });
        })
    }
    else{
        return res.status(401).json({
            message:'Session expired'
        })
    }

}
