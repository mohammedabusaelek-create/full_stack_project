const User=require('../models/usreSchemea')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
exports.register=async(req,res)=>{
try{
const {name,email,password,role,phone,id,address,businessDetails}=req.body
let user=await(User.findOne({email}))
if(user)return res.status(400).json("The User Already exists")
    const salt =await bcrypt.genSalt(10)
const hash_password=await bcrypt.hash(password,salt)
user=new User({
name,
email,
password:hash_password,
role,
phone,

id
,address,
businessDetails
})




await user.save()
const token =jwt.sign(
    {userId:user._id,role:user.role},
    process.env.JWT_SECRET,
    {expiresIn:'12h'}


  
)
res.status(201).json({
    
token,
  user:{userid:user._id,role:user.role},
})
}catch(err){

console.error(err)   
res.status(500).send("this a error in server"
    )
}




}
exports.login= async(req,res)=>{

try{
const {email
    ,password
}=req.body
const user=await User.findOne({email})


if(!user)return res.status(400).json({msg:"this  user data is not "}, )

    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch) return res.status(400).json({msg:" خطا في كلمة السر او اسم المستخدم  "})
         const token=jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.json({token,user:{
id:user._id,name:user.name,
role:user.role

        }})
}catch(err){
   console.log(err.message);

    res.status(500).send("error in the server ")
}

    
}