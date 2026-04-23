const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderProduct');
const auth = require('../middleware/auth');
const Ath  = require('../middleware/Athorize');


router.post('/', auth, orderController.cerateOrder);


router.put('/confirm/:id', auth, orderController.con_firm_order);

router.get('/incoming', auth, orderController.getIncomingOrders); 


router.get('/my-orders', auth, orderController.getMyOrders);
router.post('/pay', auth,orderController.payOrder)
module.exports = router;