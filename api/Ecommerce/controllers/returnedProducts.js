const mongoose	= require("mongoose");

const ReturnedProducts = require('../models/returnedProducts');

exports.get_returned_products = (req,res,next)=>{
    ReturnedProducts.aggregate([{ $lookup:
       {
         from: 'products',
         localField: 'product_ID',
         foreignField: '_id',
         as: 'productsArray'
       }
     }])
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
