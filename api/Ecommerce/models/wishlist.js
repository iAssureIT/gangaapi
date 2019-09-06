const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
	_id			          : mongoose.Schema.Types.ObjectId,
    user_ID               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    product_ID            : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    wishlistItems         : Array,
    wishlistTotal         : Number,
    deliveryAdd           : {
        name              : String,
        houseNo           : String,
        street            : String,
        landmark          : String,
        pin               : String,
        city              : String,
        state             : String,
        mob               : String,
        addType           : String,
    },
    paymentMethod         : String,
    createdBy             : String,
    createdAt             : Date
});

module.exports = mongoose.model('wishlist',wishlistSchema);