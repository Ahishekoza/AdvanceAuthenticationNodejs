import jwt_token from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const Auth = (req,res,next) => {

   try{
    const token = req.headers.authorization.split(' ')[1]
    const decode = jwt_token.verify(token,process.env.SECRET_KEY)
    req.user = decode
    next()
   }catch(e){
    return res.status(401).json({
        message:"Invalid token"
    })
   }

}

export const localVariables = (req, res, next) => {
    req.app.locals={
        OTP : null,
        resetsession : false
    }

    next()
}

