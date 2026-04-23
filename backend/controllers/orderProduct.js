const Order = require('../models/OrderSchema');
const Product = require('../models/productSchema');
const User = require('../models/usreSchemea');

exports.cerateOrder = async (req, res) => {
    
    
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "فشل التحقق من الهوية، يرجى تسجيل الدخول مجدداً" });
        }

        const productId = req.body.items[0].product; 
        const quantity = req.body.items[0].quantity;
        const sellerId = req.body.seller; 

        const buyerId = req.user.userId || req.user.id;

    

  
        const product1 = await Product.findById(productId);
        
        
        console.log("📦 المنتج المكتشف:", product1 ? product1.title : "لم يتم العثور على منتج!");

        if (!product1) return res.status(404).json({ msg: "المنتج غير موجود في قاعدة البيانات" });

        
        if (product1.quantity < quantity) {
            return res.status(400).json({ msg: "عذراً، الكمية المطلوبة غير متوفرة" });
        }

        const sel = await User.findById(sellerId);
        if (!sel) return res.status(404).json({ msg: "البائع غير موجود" });

    
        let trans_type = "";
        const buyerRole = req.user.role;
        const sellerRole = sel.role;

        if (sellerRole === 'Farmer' && buyerRole === 'Company') trans_type = 'F-C';
        else if (sellerRole === 'Company' && buyerRole === 'Merchant') trans_type = 'C-M';
        else if (sellerRole === 'Merchant' && buyerRole === 'Citizen') trans_type = 'M-Cit';
        else return res.status(403).json({ msg: `غير مسموح بالشراء بين (${buyerRole}) و (${sellerRole})` });

    
        product1.quantity -= quantity;
        if (product1.quantity === 0) product1.isAvailable = false;
        await product1.save();

  
        const nwe_order = new Order({
            buyer: buyerId,
            seller: sel._id,
            items: [{
                product: product1._id,
                quantity,
                priceAtPurchase: product1.price
            }],
            totalAmount: product1.price * quantity,
            transactionType: trans_type,
            status: 'Pending'
        });

        const savedOrder = await nwe_order.save();
        
   
        res.status(201).json({ msg: "تم إرسال طلب الشراء بنجاح", order: savedOrder });

    } catch (err) {
      
        res.status(500).json({ msg: "حدث خطأ في السيرفر", error: err.message });
    }
};

exports.con_firm_order = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('items.product');

        if (!order) return res.status(404).json({ msg: "الطلب غير موجود" });

        if (order.seller.toString() !== req.user.userId) {
            return res.status(401).json({ msg: "غير مصرح لك بالموافقة" });
        }

        order.status = 'Confirmed';
        await order.save();

        for (const item of order.items) {
            const originalProduct = item.product;
            if (!originalProduct) continue;

            const product_buyer = new Product({
                title: originalProduct.title,
                category: originalProduct.category,
                description: originalProduct.description,
                quantity: item.quantity,
                unit: originalProduct.unit,
                price: originalProduct.price,
                current: order.buyer, 
                original_f: originalProduct.original_f || originalProduct.current,
                isAvailable: true
            });
            await product_buyer.save();
        }

        res.json({ msg: "تم تأكيد الطلب ونقل الملكية بنجاح" });
    } catch (err) {
        console.error("Confirm Error:", err.message);
        res.status(500).send("خطأ في تأكيد الطلب");
    }
};
exports.getIncomingOrders = async (req, res) => {
    try {
        const sellerId = req.user.userId || req.user.id;

        const orders = await Order.find({ seller: sellerId })
            .populate({
                path: 'buyer',
                model: 'User',
                select: 'name email role'
            })
            .populate({
                path: 'items.product',
                model: 'Product',
                select: 'title price units'
            })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {

        res.status(500).json({ msg: "خطأ في السيرفر" });
    }
};
exports.getMyOrders = async (req, res) => {
    try {
  
        const orders = await Order.find({ buyer: req.user.userId })
            .populate('seller', 'username email')
            .populate('items.product');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ msg: "خطأ في السيرفر", error: err.message });
    }
};
exports.payOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

 
        if (!orderId) {
            return res.status(400).json({ msg: "رقم الطلب (orderId) مفقود" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: "الطلب غير موجود" });
        }

    
        order.paymentStatus = 'Paid';
        order.status = 'Confirmed'; 
        order.paymentDate = new Date();

        await order.save();
        res.json({ msg: "✅ تم الدفع بنجاح" });

    } catch (err) {
     
        res.status(500).json({ msg: "خطأ في السيرفر: " + err.message });
    }
};