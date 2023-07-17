import mongoose from 'mongoose';

export const userModel = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please Provide a username"],
        unique:[true,"Username exists"]
    },
    password:{
        type:String,
        required:[true,"Please Provide a password"],
        unique:false
    },
    email:{
        type:String,
        required:[true,"Please provide a email address"],
        unique:true
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    mobile:{
        type:Number
    },
    address:{
        type:String,
    },
    profile:{
        type:String,
    }

})

export default  mongoose.model('Users',userModel)

