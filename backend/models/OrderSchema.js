const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
   
    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
  
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    

    items: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        },
        priceAtPurchase: { 
            type: Number, 
            required: true 
        }
    }],
    
    
    totalAmount: { 
        type: Number, 
        required: true 
    },
    
  
    transactionType: { 
        type: String, 
        enum: ['F-C', 'C-M', 'M-Cit'], 
        required: true 
    },
    
    
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'OutForDelivery', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    
    paymentStatus: { 
        type: String, 
        enum: ['Unpaid', 'Paid'], 
        default: 'Unpaid' 
    },

   
    paymentDate: {
        type: Date
    }

}, { 
    timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema);