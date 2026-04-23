const express=require('express')
const router =express.Router()
const product_controllers=require('../controllers/productcontrollers')

const auth=require('../middleware/Auth')
const Ath=require('../middleware/Athorize')


router.get('/',auth,product_controllers.get_product)
router.post('/add',auth,Ath('Farmer','Company','Merchant'),product_controllers.add_product)
router.put('/:id',auth,product_controllers.updateProduct)
module.exports=router