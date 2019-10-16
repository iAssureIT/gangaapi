const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
	_id			          : mongoose.Schema.Types.ObjectId,
    user_ID               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    cartItems             : [
        {
            product_ID          : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            currency            : String,
            productCode         : String,
            productName         : String,
            section_ID          : { type: mongoose.Schema.Types.ObjectId, ref: 'section' },
            section             : String,
            category_ID         : { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
            category            : String,
            subCategory_ID      : String,
            subCategory         : String,
            productImage        : Array,
            quantity            : Number,
            discountedPrice     : Number,
            originalPrice       : Number,
            actualPrice         : Number,
            offeredPrice        : Number,
            totalForQantity     : Number
        }
    ],
    cartTotal             : Number,
    deliveryAddress           : {
        name              : String,
        email             : String,
        addressLine1      : String,
        addressLine2      : String,
        pincode           : String,
        city              : String,
        state             : String,
        country           : String,
        mobileNumber      : String,
        addType           : String,
    },
    paymentMethod         : String,
    createdBy             : String,
    createdAt             : Date
});

module.exports = mongoose.model('carts',cartSchema);