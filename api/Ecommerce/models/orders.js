const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	_id			              : mongoose.Schema.Types.ObjectId,
    orderID                   : Number,
    user_ID                   : String,
    emailID                   : String,
    BA_ID                     : String, 
    userFullName              : String,
    userName                  : String,
    numericOrderID            : Number,
    cartTotal                 : Number,
    currency                  : String,
    totalAmount               : Number,
    transactionID             : Number,
    status                    : String,
    createdAt                 : Date,
    products                  : [
        {
            "productId"         : String,
            "productName"       : String,
            "price"             : Number,
            "currency"          : String,
            "quantity"          : Number,
            "total"             : Number,
            "indexInProducts"   : Number,
            "productImage"      : Array,
            "category"          : String,
            "subCategory"       : String,
        }
    ],
    paymentMethod             : String,
    productLength             : Number,
    totalQuantity             : Number,
    deliveryAddress           : {
                                              "name"            : String,
                                              "email"           : String,
                                              "addressLine1"    : String,
                                              "addressLine2"    : String,
                                              "pincode"         : String,
                                              "city"            : String,
                                              "state"           : String,
                                              "mobileNumber"    : String,
                                              "country"         : String,
                                },
    deliveryStatus            : [{
                                    "status"          : String,
                                    "expDeliveryDate" : Date,
                                    "Date"            : Date,
                                    "userid"           : String
                                }],
    businessAssociate         : String,
    createdBy                 : String,
    createdAt                 : Date
});

module.exports = mongoose.model('orders',orderSchema);