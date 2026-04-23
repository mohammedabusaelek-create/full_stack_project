const Product = require('../models/productSchema'); 
const User = require('../models/usreSchemea'); 


exports.add_product = async (req, res) => {
    try {
        const { title, category, description, quantity, unit, price } = req.body;
        
        const new_product = new Product({
            title,
            category,
            unit,
            description,
            quantity,
            price,
            current:req.user.userId,
            original_f: req.user.role === 'Farmer' ? req.user.userId : null
        });

        const product_save = await new_product.save();
        res.status(201).json(product_save);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('error in the add the product');
    }
};

async function getIdByRole(roleName) {
    const users = await User.find({ role: roleName }).select('_id');
    return users.map(user => user._id);
}




exports.get_product = async (req, res) => {
    try {
        const userRole = req.user.role;
    
        let query = { 
            isAvailable: true,
            quantity: { $gt: 0 } 
        }; 




        if (userRole === 'Farmer') {
   
            return res.json([]); 
        }


        else if (userRole === 'Company') {
        
            const farmerIds = await getIdByRole('Farmer');
            query.current = { $in: farmerIds };
        } 

        
        else if (userRole === 'Merchant') {
        
            const companyIds = await getIdByRole('Company');
            query.current = { $in: companyIds };
            
        
            query.original_f = { $ne: null }; 
        } 


        else if (userRole === 'Citizen') {
      
            const merchantIds = await getIdByRole('Merchant');
            query.current = { $in: merchantIds };
        }

      
        const products = await Product.find(query).populate({
            path: 'current',
            select: 'name role address'
        });

     
        const filteredProducts = products.filter(p => {
            if (userRole === 'Company') return p.current?.role === 'Farmer';
            if (userRole === 'Merchant') return p.current?.role === 'Company';
            if (userRole === 'Citizen') return p.current?.role === 'Merchant';
            return false;
        });

        res.json(filteredProducts);

    } catch (err) {
        console.error( err.message);
        res.status(500).json({ msg: "حدث خطأ في السيرفر أثناء جلب المنتجات" });
    }
};
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ msg: "the product is not found" });
        }

    
        if (product.current.toString() !== req.user.userId) {
            return res.status(401).json({ msg: "not authorized to update this product" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );

        res.json(updatedProduct);

    } catch (err) {
   console.error(err.message);
        res.status(500).send({ msg: "error in update a product" });
    }
};