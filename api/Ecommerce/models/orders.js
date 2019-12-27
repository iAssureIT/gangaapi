const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	_id			              : mongoose.Schema.Types.ObjectId,
    orderID                   : Number,
    user_ID                   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    emailID                   : String,
    BA_ID                     : { type: mongoose.Schema.Types.ObjectId, ref: 'businessAssociate' }, 
    userFullName              : String,
    userName                  : String,
    numericOrderID            : Number,
    discount                  : Number,
    cartTotal                 : Number,
    total                     : Number,
    currency                  : String,
    transactionID             : Number,
    status                    : String,
    createdAt                 : Date,
    products                  : [
        {
            "product_ID"        : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            "productName"       : String,
            "discountPercent"   : Number,
            "discountedPrice"   : Number,
            "originalPrice"     : Number,
            "color"             : String,
            "size"              : String,
            "currency"          : String,
            "quantity"          : Number,
            "subTotal"          : Number,
            "saving"            : Number,
            "productImage"      : Array,
            "section_ID"        : { type: mongoose.Schema.Types.ObjectId, ref: 'section' },
            "section"           : String,
            "category_ID"       : { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
            "category"          : String,
            "subCategory_ID"    : String,
            "subCategory"       : String,
            "status"            : String,
            "returnedDate"      : Date
        }
    ],
    paymentMethod             : String,
    productLength             : Number,
    cartQuantity              : Number,
    deliveryAddress           : {
                                    "name"            : String,
                                    "email"           : String,
                                    "addressLine1"    : String,
                                    "addressLine2"    : String,
                                    "pincode"         : String,
                                    "city"            : String,
                                    "district"        : String,
                                    "stateCode"       : String,
                                    "state"           : String,
                                    "mobileNumber"    : String,
                                    "countryCode"     : String,
                                    "country"         : String,
                                    "addType"         : String,
                                },
    deliveryStatus            : [{
                                    "status"          : String,
                                    "expDeliveryDate" : Date,
                                    "Date"            : Date,
                                    "userid"          : String
                                }],
    businessAssociate         : String,
    createdBy                 : String,
    createdAt                 : Date
});

module.exports = mongoose.model('orders',orderSchema);