const mongoose	= require("mongoose");

const Carts = require('../models/cart');
const _ = require('underscore');    
exports.insert_cart = (req,res,next)=>{
    var formValues = req.body;
    // console.log('formValues', formValues);
    var user_ID = req.body.user_ID;
	Carts.findOne({"user_ID": req.body.user_ID})
		.exec()
		.then(cartData =>{
            if(cartData){
                if(cartData.cartItems.length > 0){
                    var newArr = [];
                    var matcheIdVal = 0;
                    
                    // **************************************************
                    // **************************************************
                    var getTrueVal = true;
                    for(n=0;n<cartData.cartItems.length;n++){
                        if(cartData.cartItems[n].product_ID == formValues.product_ID){
                            var getTrueVal = false;
                            break;
                        }
                    }
                    // **************************************************
                    // **************************************************
                    if(!getTrueVal){
                        for(j=0;j<cartData.cartItems.length;j++){
                            
                            if(cartData.cartItems[j].product_ID == formValues.product_ID){
                                // Increase existing quantity if product is availbale
                                
                                var newQuantity = parseInt(formValues.quantity) + parseInt(cartData.cartItems[j].quantity);
                                var newTotal = newQuantity * parseInt(formValues.discountedPrice);
                                var newFinalCartVal = 0;
                                
                                // console.log('newQuantity',newQuantity, 'newTotal',newTotal);
                                // To calculate final Price
                                // console.log('cartData.cartItems', cartData.cartItems);
                                for(k=0;k<cartData.cartItems.length;k++){
                                    if(cartData.cartItems[k].product_ID == formValues.product_ID){
                                        var newFinalCartVal = parseInt(newFinalCartVal + newTotal);
                                        // console.log('newFinalCartVal 3====', newFinalCartVal);
                                    }else{
                                        var newFinalCartVal = parseInt(newFinalCartVal +  cartData.cartItems[k].totalForQantity); 
                                    }
                                }
                              
                                // console.log('newFinalCartVal',newFinalCartVal);
                            
                            Carts.updateOne(
                                {'_id':cartData._id,'cartItems.product_ID':formValues.product_ID},
                                {
                                    $set:{
                                            'cartItems.$.quantity':newQuantity,
                                            'cartItems.$.totalForQantity':newTotal,
                                            'cartTotal':newFinalCartVal,
                                        },
                
                                }
                            )
                            .exec()
                            .then(data=>{
                                console.log('cartData', cartData.cartItems.length);
                                if(data.nModified == 1){
                                    res.status(200).json({
                                        "message": "Product added to cart successfully.",
                                        "cartCount" : cartData.cartItems.length
                                    });
                                }else{
                                    res.status(401).json({
                                        "message": "Cart Not Found 1"
                                    });
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                            }
                        }
                    }else{
                        for(j=0;j<cartData.cartItems.length;j++){
                            if(cartData.cartItems[j].product_ID == formValues.product_ID){
                                // Increase existing quantity if product is availbale
                                var newQuantity = parseInt(formValues.quantity) + parseInt(cartData.cartItems[j].quantity);
                                var newTotal = newQuantity * parseInt(formValues.discountedPrice);
                                var newFinalCartVal = 0;
    
                                // To calculate final Price
                                for(k=0;k<cartData.cartItems.length;k++){
                                    if(cartData.cartItems[k].product_ID == formValues.product_ID){
                                        newFinalCartVal = newFinalCartVal + newTotal;
                                    }else{
                                        newFinalCartVal = newFinalCartVal +  cartData.cartItems[k].totalForQantity;
                                    }
                                }
                                // console.log('newFinalCartVal2',newFinalCartVal);
                                Carts.updateOne(
                                    {'_id':cartData._id,'cartItems.product_ID':formValues.product_ID},
                                    {
                                        $set:{
                                                'cartItems.$.quantity':newQuantity,
                                                'cartItems.$.totalForQantity':newTotal,
                                                'cartTotal':newFinalCartVal,
                                            },
                    
                                    }
                                )
                                .exec()
                                .then(data=>{
                                    console.log('data', data);
                                    if(data.nModified == 1){
                                        res.status(200).json({
                                            "message": "Product added to cart successfully.",
                                            "cartCount" : cartData.cartItems.length
                                        });
                                    }else{
                                        res.status(401).json({
                                            "message": "Cart Not Found 2"
                                        });
                                    }
                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                                break;
                                
                            }else{
                                // If proct not in list, add new product in list
                                var cartArrLength = cartData.cartItems.length;
                                var cartTotal = formValues.totalForQantity;
                                var newArr = [];
                                for(i=0;i<cartArrLength;i++){
                                    var cartTotal = cartTotal + cartData.cartItems[i].totalForQantity;
                                    newArr.push(cartData.cartItems[i]);
                                }
                                formValues.cartIndex = cartArrLength;
                                newArr.push({
                                    "product_ID"        : formValues.product_ID,
                                    "currency"          : formValues.currency,
                                    "productCode"       : formValues.productCode,
                                    "productName"       : formValues.productName,
                                    "category"          : formValues.category,
                                    "subCategory"       : formValues.subCategory,
                                    "productImage"      : formValues.productImage,
                                    "quantity"          : formValues.quantity,
                                    "discountedPrice"   : formValues.discountedPrice,
                                    "originalPrice"     : formValues.originalPrice,
                                    "actualPrice"       : formValues.actualPrice,
                                    "offeredPrice"      : formValues.offeredPrice,
                                    "totalForQantity"   : formValues.totalForQantity,
                                });
                                // console.log('cartTotal1',cartTotal);
                                Carts.updateOne(
                                    {"user_ID":user_ID},
                                    { $set: {
                                                "cartItems"     :   newArr,
                                                "cartTotal"     :   cartTotal,
                                            }
                                    }
                                )
                                .exec()
                                .then(data=>{
                                    if(data.nModified == 1){
                                        res.status(200).json({
                                            "message": "Product added to cart successfully.",
                                            "cartCount" : newArr.length
                                        });
                                    }else{
                                        res.status(401).json({
                                            "message": "Cart Not Found 3"
                                        });
                                    }
                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                            }
                        }
                    }

                   
                    return true;
                } else {
                    // formValues.cartIndex = 0;s
                    var cartTotal = formValues.totalForQantity;
                    // console.log('cartTotal 2', cartTotal);
                    var cartItems = [{
                        "product_ID"        : formValues.product_ID,
                        "currency"          : formValues.currency,
                        "productCode"       : formValues.productCode,
                        "productName"       : formValues.productName,
                        "category"          : formValues.category,
                        "subCategory"       : formValues.subCategory,
                        "productImage"      : formValues.productImage,
                        "quantity"          : formValues.quantity,
                        "discountedPrice"   : formValues.discountedPrice,
                        "originalPrice"     : formValues.originalPrice,
                        "actualPrice"       : formValues.actualPrice,
                        "offeredPrice"      : formValues.offeredPrice,
                        "totalForQantity"   : formValues.totalForQantity,
                    }];
                    //console.log('cartItems',cartItems);
                    Carts.updateOne(
                        {"user_ID":user_ID},
                        { $set: {
                                    "cartItems"     :   cartItems,
                                    "cartTotal"     :   cartTotal,
                                }
                        }
                    )
                    .exec()
                    .then(data=>{
                        if(data.nModified == 1){
                            res.status(200).json({
                                "message": "Product added to cart successfully.",
                                "cartCount" : 1
                            });
                        }else{
                            res.status(401).json({
                                "message": "Cart Not Found 4"
                            });
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                    return true;
                    
                }
            } else{
                // formValues.cartIndex = 0;
                var cartTotal = formValues.totalForQantity;
                // console.log('cat', cartTotal);
                var cartItems = [{
                    "product_ID"        : formValues.product_ID,
                    "currency"          : formValues.currency,
                    "productCode"       : formValues.productCode,
                    "productName"       : formValues.productName,
                    "category"          : formValues.category,
                    "subCategory"       : formValues.subCategory,
                    "productImage"      : formValues.productImage,
                    "quantity"          : formValues.quantity,
                    "discountedPrice"   : formValues.discountedPrice,
                    "originalPrice"     : formValues.originalPrice,
                    "actualPrice"       : formValues.actualPrice,
                    "offeredPrice"      : formValues.offeredPrice,
                    "totalForQantity"   : formValues.totalForQantity,
                }];
                

                const cartDetails = new Carts({
                    _id                       : new mongoose.Types.ObjectId(),  
                    "user_ID"       :   user_ID,
                    "cartItems"     :   cartItems,
                    "cartTotal"     :   cartTotal,                  
                    
                });
                cartDetails.save()
                .then(data=>{
                    res.status(200).json({
                        "message": "Product added to cart successfully.",
                        "cartCount" : 1
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
                return true;
                
            }
		
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
};

exports.list_cart = (req,res,next)=>{
    Carts.find({"user_ID": req.params.user_ID})       
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
exports.all_list_cart = (req,res,next)=>{
    Carts.find()       
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

exports.count_cart = (req,res,next)=>{
    Carts.findOne({"user_ID": req.params.user_ID})     
        .exec()
        .then(data=>{
            res.status(200).json(data.cartItems.length);

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.remove_cart_item = (req, res, next)=>{
    // console.log(req.body.cartItem_ID, req.body.user_ID);
    Carts.findOne({"user_ID": req.body.user_ID}) 
        .exec()
        .then(cartData=>{
            var cartFinalArr = [];

            if(cartData){
                var finalCartVal = cartData.cartTotal;
                var cartLength = cartData.cartItems.length;
                var cartLengthRef;
                var lengthsubstitutuon = 0;
                if(cartLength > 0){
                    for(i=0;i<cartData.cartItems.length;i++){
                        if(cartData.cartItems[i]._id==req.body.cartItem_ID){
                            lengthsubstitutuon = -1;
                            finalCartVal = finalCartVal - cartData.cartItems[i].totalForQantity;
                            // console.log('finalCartVal',finalCartVal);
                            
                        }else{
                            cartLengthRef = i + lengthsubstitutuon;
                            // console.log("cartData.cartItems[cartItem_ID].quantity: ",cartData.cartItems[i].quantity);
                            var obj = {
                                "product_ID"        : cartData.cartItems[i].product_ID,
                                "productCode"       : cartData.cartItems[i].productCode,
                                "productName"       : cartData.cartItems[i].productName,
                                "productImage"      : cartData.cartItems[i].productImage,
                                "quantity"          : cartData.cartItems[i].quantity,
                                "discountedPrice"   : cartData.cartItems[i].discountedPrice,
                                "originalPrice"     : cartData.cartItems[i].originalPrice,
                                "actualPrice"       : cartData.cartItems[i].actualPrice,
                                "offeredPrice"      : cartData.cartItems[i].offeredPrice,
                                "totalForQantity"   : cartData.cartItems[i].totalForQantity,
                                "createdAt"         : cartData.cartItems[i].createdAt,
                                "cartIndex"         : cartLengthRef,
                            }
                            cartFinalArr.push(obj);
                        }
                    }
                }
            }
            
            Carts.updateOne(
                {"user_ID": req.body.user_ID},
                {
                    $set:{
                            'cartItems':cartFinalArr,
                            // 'cartItems.$.totalForQantity':totalIndPrice,
                            'cartTotal':parseInt(finalCartVal),
                        },

                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json({
                        "message": "Product removed from cart successfully."
                    });
                }else{
                    res.status(401).json({
                        "message": "Cart Not Found 1"
                    });
                }
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
};
exports.change_cart_item_quantity = (req, res, next)=>{
    // console.log(req.body.user_ID,req.body.cartItem_ID,req.body.quantityAdded,req.body.totalIndPrice);
    Carts.findOne({"user_ID":req.body.user_ID})       
    .exec()
    .then(cartData=>{
        if(cartData){
            var cartLength = cartData.cartItems.length;

            if(cartLength > 0){
                var finalCartVal = 0;
                for(i=0;i<cartData.cartItems.length;i++){
                    // console.log(cartData.cartItems[i]._id+'=='+req.body.cartItem_ID)
                    if(cartData.cartItems[i]._id==req.body.cartItem_ID){
                        finalCartVal = finalCartVal + req.body.totalIndPrice;
                    }else{
                        finalCartVal = finalCartVal + cartData.cartItems[i].totalForQantity;
                    }
                }
            }
        }
                
        Carts.updateOne(
            {"user_ID":req.body.user_ID,'cartItems._id':req.body.cartItem_ID},
            {
                $set:{
                        'cartItems.$.quantity':parseInt(req.body.quantityAdded),
                        'cartItems.$.totalForQantity':req.body.totalIndPrice,
                        'cartTotal':finalCartVal,
                    },

            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Product quantity changed successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Cart Not Found 1"
                });
            }
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
};
exports.add_address_to_cart = (req, res, next)=>{
    Carts.findOne({"user_ID": req.body.user_ID})       
        .exec()
        .then(cartData=>{
            if(cartData){
                Carts.updateOne({ "_id" : cartData._id },
                { $set : 
                    {
                        deliveryAddress : {
                            "name"            : req.body.name,
                            "email"           : req.body.email,
                            "addressLine1"    : req.body.addressLine1,
                            "addressLine2"    : req.body.addressLine2,
                            "pincode"         : req.body.pincode,
                            "city"            : req.body.city,
                            "state"           : req.body.state,
                            "mobileNumber"    : req.body.mobileNumber,
                            "country"         : req.body.country,
                            "addType"         : req.body.addType,
                        }
                    }
                }) 
                .exec()
                .then(data=>{
                    // if(data.nModified == 1){
                        res.status(200).json({
                            "message": "Address added to cart successfully."
                        });
                    // }else{
                    //     res.status(401).json({
                    //         "message": "Cart Not Found"
                    //     });
                    // }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
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

exports.list_cart=(req , res , next)=>{

    Carts.find({"user_ID": req.params.user_ID})
    .exec()
    .then(data =>{
        res.status(200).json(data);       
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            error:error
        })

    })

}
exports.user_cart=(req , res , next)=>{

    Carts.findOne({"user_ID": req.params.user_ID})
    .exec()
    .then(data =>{
        res.status(200).json(data);       
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            error:error
        })

    })

}
exports.add_paymentmethod_to_cart = (req, res, next)=>{
    console.log('re.body', req.body);
    Carts.updateOne({"user_ID": req.body.user_ID},
    { $set : 
        {
            "paymentMethod" : req.body.payMethod,
        }
    }) 
    .exec()
    .then(data=>{
        // if(data.nModified == 1){
            res.status(200).json({
                "message": "Payment Method added successfully."
            });
        // }else{
        //     res.status(401).json({
        //         "message": "Cart Not Found"
        //     });
        // }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};