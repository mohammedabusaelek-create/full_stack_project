const mongoose=require('mongoose')
const productSchema=mongoose.Schema({

title:{type:String,required:true},
category:{type:String,enum:['Vegetables','Fruits',"Leafy"],required:true,
description:String,
ImageUrl:String
},
current:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
,quantity:{type:Number,required:true},
units:{type:String,enum:['Kg','Box','Ton'],default:'Kg'},

price:{type:Number,required:true},
original_f:{type:mongoose.Schema.Types.ObjectId,ref:"Users"}

,isAvailable:{type:Boolean,default:true}

},{times:true})
module.exports=mongoose.model('Product',productSchema)