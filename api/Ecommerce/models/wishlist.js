const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
	_id			          : mongoose.Schema.Types.ObjectId,
    user_ID               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    product_ID            : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    createdBy             : String,
    createdAt             : Date
});

module.exports = mongoose.model('wishlist',wishlistSchema);