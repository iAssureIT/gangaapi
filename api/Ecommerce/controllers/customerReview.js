const mongoose  = require("mongoose");

const CustomerReview = require('../models/customerReview');

exports.insertCustomerReview = (req,res,next)=>{
	CustomerReview.find()
		.exec()
		.then(data =>{
			const customerReview = new CustomerReview({
                _id                       : new mongoose.Types.ObjectId(),                    
                customerID                : req.body.customerID,
			    orderID                   : req.body.orderID,
			    productID                 : req.body.productID,
			    rating                    : req.body.rating,
			    customerReview            : req.body.customerReview,
                createdAt                 : new Date()
            });
            customerReview.save()
            .then(data=>{
                res.status(200).json({
                    "message": "Thanks for your review."
                });
            })
            .catch(err =>{
            	console.log(err);
                res.status(500).json({
                    error: err
                });
            });
		
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}