const Ath=(...role)=>{

    return (req ,res,next )=>{if(!role.includes(req.user.role))
        {return res.status(403).json({msg:`"is not " (${req.user.role})`} 


            
        )}
    
    
     next()
    }
    

}
module.exports=Ath