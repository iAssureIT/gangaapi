const mongoose  = require("mongoose");

const CustomerReview = require('../models/customerReview');

exports.insertCustomerReview = (req,res,next)=>{
	
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
	
};

exports.listCustomerReview = (req,res,next)=>{
    CustomerReview.find({productID : req.params.productID})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}