const mongoose = require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const employeeSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique: true,
        required:true,
        trim:true,
        lowercase:true,
        
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    tokens:[
       {
           token:{
               type:String,
               required:true
           }
       }
    ]
})

//userdef function for hiding private data
employeeSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
} 

//userdef function for gen auth token
employeeSchema.methods.genAuthToken = async function(){
    const user=this
    const token = jwt.sign({_id:user._id.toString()},"thisisseceret",{ expiresIn:"7 days"})
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//userdef function for authentication
employeeSchema.statics.findByCredentials = async (email,password) => {
    const user = await Employee.findOne({ email })   
    if(!user){
        throw new Error("Email is incorrect")
    }
    const isMatched = await bcrypt.compare(password,user.password)
    if(!isMatched){
        throw new Error("password is incorrect")
    }
    return user
}


//userdef function for authentication
employeeSchema.statics.findByEmail = async (email) => {
    // console.log("erwe")
    const user = await Employee.findOne({ email })
    console.log(user,"user")
    if(!user){
        throw new Error("unable to find")
    }
    return user
}

//userdef function for authentication
employeeSchema.statics.findUserById = async (id) => {
    console.log("reached schema")
    const user = await Employee.findById({_id : id})
    // console.log(user,"user")
    if(!user){
        throw new Error("unable to find")
    }
    return user
}


//using mongoose middleware for hashing passwords
employeeSchema.pre("save",async function (next) {
    const user =this
    
   if(user.isModified('password')){
       user.password=await bcrypt.hash(user.password,8)
   }
    next()
})

//creating a company model
const Employee = mongoose.model('employees',employeeSchema)

module.exports=Employee