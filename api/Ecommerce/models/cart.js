const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
	_id			          : mongoose.Schema.Types.ObjectId,
    user_ID               : String,
    cartItems             : [
        {
            product_ID          : String,
            currency            : String,
            productCode         : String,
            productName         : String,
            category            : String,
            subCategory         : String,
            productImage        : Array,
            quantity            : Number,
            offeredPrice        : Number,
            actualPrice         : Number,
            totalForQantity     : Number
        }
    ],
    cartTotal             : Number,
    deliveryAdd           : {
        name              : String,
        addressLine1      : String,
        addressLine2      : String,
        pincode           : String,
        city              : String,
        state             : String,
        mobileNumber      : String,
        addType           : String,
    },
    paymentMethod         : String,
    createdBy             : String,
    createdAt             : Date
});

module.exports = mongoose.model('carts',cartSchema);