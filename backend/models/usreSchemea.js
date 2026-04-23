const mongoose =require('mongoose')
 const userSchema=mongoose.Schema({
name:{type:String,required:true},
email:{type:String,required:true,unique:true},
password:{type:String,required:true},
role:{
type:String,
enum:['Farmer','Company' ,'Merchant','Citizen'],
required:true
},
phone:{type:String,required:true},
id:{type:String,unique:true,sparse:true,match:/^\d{10}$/},

address:
{city:String,details:String},
businessDetails:{farmName:String,
    commercialReg:String,
storName:String 


}
}, {timestamps:true})
module.exports=mongoose.model('User',userSchema) 

