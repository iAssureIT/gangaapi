const mongoose  = require("mongoose");
const Products = require('../models/products');
const CustomerReview = require('../models/customerReview');
const moment                = require('moment-timezone');

exports.insertCustomerReview = (req,res,next)=>{
	
			const customerReview = new CustomerReview({
                _id                       : new mongoose.Types.ObjectId(),                    
                customerID                : req.body.customerID,
                customerName              : req.body.customerName,
			    orderID                   : req.body.orderID,
			    productID                 : req.body.productID,
			    rating                    : req.body.rating,
			    customerReview            : req.body.customerReview,
			    status                    : 'Publish',
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
};
exports.list_customer_reviews = (req,res,next)=>{
    CustomerReview.find()
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
};
exports.update_review_status = (req,res,next)=>{
    CustomerReview.updateOne(
        { _id:req.body.review_ID},  
        {
            $set:{
                "status" : req.body.status,
            }
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({
                "message": "Success",
            });
        }else{
            res.status(401).json({
                "message": "Product Not Found"
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.customerReviewAvg = (req,res,next)=>{
    CustomerReview.aggregate([
        { $group: { _id : 1, avg : { $avg: "$rating" } } },
        {$match:
            {"productID" : req.params.productID} 
        }
    ])
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
};
exports.listCustomerReviewbucustomerid = (req,res,next)=>{
    CustomerReview.aggregate([
        { $lookup:
            {
             from: 'products',
             localField: 'productID',
             foreignField: '_id',
             as: 'productDetails'
            }
        },
        {$match:
            {"customerID" : req.params.customerID} 
        },
        {
            $sort: {
              "reviewlist.createdAt": -1
            }
        }
    ])
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
};
exports.delete_review = (req,res,next)=>{
    CustomerReview.deleteOne({_id:req.params.reviewID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message": "Review Deleted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.updateCustomerReview = (req, res, next) => {
    CustomerReview.updateOne(
        { _id: req.body.rating_ID},
        {
            $set: {
                "rating"                    : req.body.rating,
                "customerReview "           : req.body.customerReview,
            }
        }
    )
    .exec()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.add_admin_comment = (req, res, next) => {
    CustomerReview.updateOne(
        { _id: req.body.rating_ID},
        {
            $set: {
                "adminComment"           : req.body.adminComment,
            }
        }
    )
    .exec()
    .then(data => {
        res.status(200).json({
            message : 'Comment added successfully.'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.list_review = (req,res,next)=>{
    CustomerReview.aggregate([
   { $lookup:
       {
        from: 'products',
        localField: 'productID',
        foreignField: '_id',
        as: 'productDetails'
       }
   },
   {
       $sort: {
         "reviewlist.createdAt": -1
       }
   }
   ])
    .skip(parseInt(req.body.startRange))
    .limit(parseInt(req.body.limitRange))
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
};

exports.count_review = (req,res,next)=>{
    CustomerReview.find({})
    .exec()
    .then(data=>{
        res.status(200).json({"dataCount":data.length});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.searchCustomerReview = (req, res, next)=>{
    var searchText = req.body.searchText;
    CustomerReview.aggregate([
       { $lookup:
           {
            from: 'products',
            localField: 'productID',
            foreignField: '_id',
            as: 'productDetails'
           }
       },
       { $match: { $or: [ 
                    {"customerReview"    : {'$regex' : '^'+searchText, $options: "i"}},
                    {"customerName"      : {'$regex' : '^'+searchText, $options: "i"}},
                    {"rating"            : {'$regex' : '^'+searchText, $options: "i"}},
                    { "productDetails"   : { $elemMatch: { "section"    : {'$regex' : '^'+searchText, $options: "i"} } } },
                    { "productDetails"   : { $elemMatch: { "category"   : {'$regex' : '^'+searchText, $options: "i"} } } },
                    { "productDetails"   : { $elemMatch: { "subCategory": {'$regex' : '^'+searchText, $options: "i"} } } },
                    { "productDetails"   : { $elemMatch: { "productName": {'$regex' : '^'+searchText, $options: "i"} } } },
                ]
           } 
       },
       {
           $sort: {
             "reviewlist.createdAt": -1
           }
       }
    ])
    .skip(parseInt(req.body.startRange))
    .limit(parseInt(req.body.limitRange))
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
};


exports.ytdreviews = (req,res,next)=>{
    //console.log('year',moment().tz('Asia/Kolkata').startOf('year'));
    //console.log('day',moment().tz('Asia/Kolkata').endOf('day'));

    CustomerReview.find({
      createdAt: {
        $gte:  moment().tz('Asia/Kolkata').startOf('year'),
        $lte:  moment().tz('Asia/Kolkata').endOf('day')
      }
    }).count()     
        .exec()
        .then(data=>{
          res.status(200).json({ "dataCount": data });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.mtdreviews = (req,res,next)=>{

    CustomerReview.find({
      createdAt: {
        $gte:  moment().tz('Asia/Kolkata').startOf('month'),
        $lte:  moment().tz('Asia/Kolkata').endOf('day')
      }
    }).count()      
        .exec()
        .then(data=>{
          res.status(200).json({ "dataCount": data });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.count_todaysreview = (req,res,next)=>{
    CustomerReview.find({ "createdAt": {$gte:  moment().tz('Asia/Kolkata').startOf('day')} }).count()
    .exec()
    .then(data=>{
        res.status(200).json({ "dataCount": data });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.UnpublishedCount = (req,res,next)=>{
    CustomerReview.find({ "status" : "Unpublish" }).count()
    .exec()
    .then(data=>{
        res.status(200).json({ "dataCount": data });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
