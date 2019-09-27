const mongoose = require('mongoose');

const customerReviewSchema = mongoose.Schema({
	_id			              : mongoose.Schema.Types.ObjectId,
    customerID                : String,
    customerName              : String,
    orderID                   : String,
    productID                 : String,
    rating                    : String,
    customerReview            : String,
    createdAt                 : Date
});

module.exports = mongoose.model('customerReview' ,customerReviewSchema);