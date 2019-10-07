const mongoose  = require("mongoose");

const Orders = require('../models/orders');
const Carts = require('../models/cart');
const Masternotifications =  require('../../coreAdmin/models/masternotifications');
const User = require('../../coreAdmin/models/users');
const BusinessAssociate = require('../models/businessAssociate');

const plivo         = require('plivo');
var request         = require('request-promise');  
const gloabalVariable 	= require('./../../../nodemon');
const _ = require('underscore');
var localUrl =  "http://localhost:"+gloabalVariable.PORT;

exports.insert_order = (req,res,next)=>{ 
    var mailSubject, mailText, smsText;
    Masternotifications.findOne({"templateType":"Email","templateName":"Order Placed Successfully"})
                      .exec()
                      .then((maildata)=>{
                        if (maildata) {
                          mailSubject = maildata.subject;
                          mailText = maildata.content
                        }
                      })
                      .catch()

    Masternotifications.findOne({"templateType":"SMS","templateName":"Order Placed Successfully"})
                      .exec()
                      .then((smsdata)=>{  
                          if (smsdata) {
                            var textcontent = smsdata.content;                              
                            var regex = new RegExp(/(<([^>]+)>)/ig);
                            var textcontent = smsdata.content.replace(regex, '');
                            textcontent   = textcontent.replace(/\&nbsp;/g, '')                     
                            smsText = textcontent
                          }
                          
                      })
                      .catch()

      var i = 0;
      if(req.body.qtys.length > 0){
        var user_ID = req.body.user_ID;
        Carts.findOne({"user_ID" : req.body.user_ID})
        .exec()
        .then(payModeObj=>{
            // console.log('payModeObj',payModeObj);
            if(payModeObj){
                var now = new Date();
                var day = now.getDay();
                var month = now.getMonth();
                var year = now.getFullYear();
                var date = now.getDate();
                // var transactionID = year+month+date+'00'+OrderId;
                var cartArray = [];
       
                if(payModeObj.cartItems.length>0){
                  //console.log('payModeObj',payModeObj);
                  var productLength = 0;
                  var totalQuantity = 0;
       
                  for(k=0;k<payModeObj.cartItems.length;k++){
                    productLength = productLength + 1;
                    totalQuantity = totalQuantity + parseInt(payModeObj.cartItems[k].quantity);
                    cartArray.push({
                      "product_ID"        : payModeObj.cartItems[k].product_ID,
                      "productName"       : payModeObj.cartItems[k].productName,
                      "discountedPrice"   : payModeObj.cartItems[k].discountedPrice,
                      "originalPrice"     : payModeObj.cartItems[k].originalPrice,
                      "actualPrice"       : payModeObj.cartItems[k].actualPrice,
                      "offeredPrice"      : payModeObj.cartItems[k].offeredPrice,
                      "currency"          : payModeObj.cartItems[k].currency,
                      "quantity"          : payModeObj.cartItems[k].quantity,
                      "total"             : payModeObj.cartItems[k].totalForQantity,
                      "productImage"      : payModeObj.cartItems[k].productImage,
                      "category"          : payModeObj.cartItems[k].category,
                      "subCategory"       : payModeObj.cartItems[k].subCategory,
       
                    });
                  }
                }
       
                User.findOne({"_id":req.body.user_ID})
                .exec()
                .then(data=>{
                    // console.log('data===mailSubject=', mailSubject,mailText);
                    console.log('data====', data);
                    request({
                     "method"    : "POST",
                     "url"       : "http://localhost:"+gloabalVariable.PORT+"/send-email",
                     "body"      :   {
                                         "email"     : data.profile.emailId,
                                         "subject"   : mailSubject,
                                         // "subject"   : 'Order Placed Successfully',
                                         // "text"      : "WOW Its done",
                                         "text"      : mailSubject,
                                         "mail"      : 'Hello '+data.profile.fullName+','+'\n'+mailText,
                                         // "mail"      : 'Hello '+data.profile.fullName+','+'\n'+"\n <br><br>Your Order has been placed successfully and will be dispached soon."+"<b></b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team GangaExpress',
                                     },
                     "json"      : true,
                     "headers"   : {
                                     "User-Agent": "Test App"
                                 }
                    })
                    .then((sentemail)=>{
                        res.header("Access-Control-Allow-Origin","*");
                        res.status(200).json({message:"Mail Sent successfully"});
                    })
                    .catch((err) =>{

                        res.status(500).json({
                            error: err
                        });
                    });
                   
                    const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                    const sourceMobile = "+919923393733";
                    //var text = "Dear User, "+'\n'+"Your Order has been placed successfully and will be dispached soon.\n";
                    

                    var text = smsText;
                    client.messages.create(
                     src=sourceMobile,
                     dst= '+91'+data.profile.mobileNumber,
                     text=text
                    ).then((result)=> {
                        // console.log("src = ",src," | DST = ", dst, " | result = ", result);
                        res.status(200).json({
                            message:"Order Placed Successfully"
                        });
                    })
                    .catch(otpError=>{
                        // console.log("otpError",otpError);
                        return res.status(501).json({
                             message: "Some Issue Occured While Placing Your Order",
                             error: otpError
                        });
                    }); 
                   request({
                     "method"    : "POST",
                     "url"       : "http://localhost:"+gloabalVariable.PORT+"/send-email",
                     "body"      :  {
                                         "email"     : "amitrshinde156@gmail.com",
                                         "subject"   : 'Order Placed Successfully',
                                         "text"      : "WOW Its done",
                                         "mail"      : 'Hello '+'Admin'+','+'\n'+"\n <br><br>You have an order placed by "+data.profile.fullName+"."+"<b></b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team GangaExpress',
                                    },
                     "json"      : true,
                     "headers"   : {
                                     "User-Agent": "Test App"
                                 }
                    })
                    .then((sentemail)=>{
                        res.header("Access-Control-Allow-Origin","*");
                        res.status(200).json({message:"Mail Sent successfully"});
                    })
                    .catch((err) =>{
                        res.status(500).json({
                            error: err
                        });
                    });
                   
                    const client2 = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                    const sourceMobile2 = "+919923393733";
                    var text2 = "Dear Admin, "+'\n'+"You have a Order by "+data.profile.fullName+".\n";
                   
                    client2.messages.create(
                     src=sourceMobile2,
                     dst= '+919049711725',
                     text=text2
                    ).then((result)=> {
                        // console.log("src = ",src," | DST = ", dst, " | result = ", result);
                        res.status(200).json({
                            message:"Order Placed Successfully"
                        });
                    })
                    .catch(otpError=>{
                        // console.log("otpError",otpError);
                        return res.status(501).json({
                             message: "Some Issue Occured While Placing Your Order",
                             error: otpError
                        });
                    });

                   
                    const order = new Orders({
                        _id               : new mongoose.Types.ObjectId(),
                      "orderID"           : Math.round(new Date().getTime()/1000),
                      "user_ID"           : req.body.user_ID,
                      "userName"          : data.profile.emailId,
                      "userFullName"      : data.profile.fullName,
                      "cartTotal"         : payModeObj.cartTotal,
                      "currency"          : 'inr',
                      "totalAmount"       : req.body.totalAmount,
                      "status"            : "UnPaid",
                      "createdAt"         : new Date(),
                      "products"          : cartArray,
                      "paymentMethod"     : payModeObj.paymentMethod,
                      "productLength"     : productLength,
                      "totalQuantity"     : totalQuantity,
                      'deliveryAddress'   : {
                                              "name"            : payModeObj.deliveryAddress.name,
                                              "email"           : payModeObj.deliveryAddress.email,
                                              "addressLine1"    : payModeObj.deliveryAddress.addressLine1,
                                              "addressLine2"    : payModeObj.deliveryAddress.addressLine2,
                                              "pincode"         : payModeObj.deliveryAddress.pincode,
                                              "city"            : payModeObj.deliveryAddress.city,
                                              "state"           : payModeObj.deliveryAddress.state,
                                              "mobileNumber"    : payModeObj.deliveryAddress.mobileNumber,
                                              "country"         : payModeObj.deliveryAddress.country,
                                              "addType"         : payModeObj.deliveryAddress.addType
                                            },
                      "deliveryStatus"   : [
                          {
                            "status"            : "New Order",
                            "Date"              : new Date(),
                            "Userid"            : req.body.user_ID,
                          }
                      ],
                    });
                    order.save()
                    .then(orderdata=>{
                        // console.log('Order data', orderdata);
                        Carts.findOne({"user_ID":req.body.user_ID})
                        .exec()
                        .then(userCart=>{
                            if(userCart){
                                Carts.update(
                                    {"_id": userCart._id},
                                    { $set: {
                                    "cartItems" : [],
                                    "cartTotal" : 0,
                                    "paymentMethod" : ""
                                    }
                                })
                                .exec()
                                .catch(error=>{
                                    res.status(500).json({
                                        error1: error
                                    });
                                })
                            }
                        })
                        .catch(error=>{
                            res.status(500).json({
                                error2: error
                            });
                        })
                        res.status(200).json({
                            "message": "Order Placed Successfully.",
                            "order_ID" : orderdata._id
                        });
                    })
                    .catch(err=>{
                        res.status(500).json({
                            error1: error
                        });
                    })
               
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error3: err
                    });
                });
            }            
                               
        })
        .catch(error=>{
            // console.log('error4', error);
            res.status(500).json({
               
                error4: error
            });
        })
    }

};
exports.update_order = (req,res,next)=>{
    Orders.updateOne(
            { _id:req.body.order_ID}, 
            {
                $set:{
                    user_ID                   : req.body.user_ID,
                    emailID                   : req.body.emailID,
                    userFullName              : req.body.userFullName,
                    numericOrderID            : req.body.numericOrderID,
                    cartTotal                 : req.body.cartTotal,
                    currency                  : req.body.currency,
                    totalAmount               : req.body.totalAmount,
                    transactionID             : req.body.transactionID,
                    status                    : req.body.status,
                    products                  : req.body.products,
                    paymentMethod             : req.body.paymentMethod,
                    productLength             : req.body.productLength,
                    totalQuantity             : req.body.totalQuantity,
                    deliveryAddress           : req.body.deliveryAddress,
                    deliveryStatus            : req.body.deliveryStatus,
                    createdAt                 : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Order Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Order Not Found"
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
exports.list_order = (req,res,next)=>{
    Orders.find({}).sort({createdAt:-1})      
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
exports.list_orderby_status = (req,res,next)=>{
    Orders.aggregate([
    { "$match": { "deliveryStatus.status" :  req.params.status} },
    { "$redact":
        {
            "$cond": {
               "if": { "$eq": [ { "$arrayElemAt": [ "$deliveryStatus.status", -1 ] }, req.params.status ] },
               "then": "$$KEEP",
               "else": "$$PRUNE"
            }
        }
    }
    ]).sort({createdAt:-1})      
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

exports.list_order_by_ba = (req,res,next)=>{

    Orders.find({businessAssociate : req.params.ba_ID}).sort({createdAt:-1})     
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


exports.list_order_with_limits = (req,res,next)=>{
    Orders.find({}).sort({createdAt:-1})
    .exec()
    .then(data=>{
        // var allData = data.map((x, i)=>{
        //     return {
        //         "_id"                   : x._id,
        //         "orderCode"           : x.orderID,
        //         "orderName"           : x.orderName,
        //         "featured"              : x.featured,
        //         "exclusive"             : x.exclusive,
        //         "status"                : x.status
        //     }
        // })
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.count_order = (req,res,next)=>{
    Orders.find({})
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
exports.fetch_order = (req,res,next)=>{
    Orders.findOne({_id : req.params.orderID}).sort({createdAt:-1})
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
exports.delete_order = (req,res,next)=>{
    Orders.deleteOne({_id:req.params.orderID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message": "Order Deleted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
 
exports.updateDeliveryStatus = (req,res,next)=>{

  var DeliveryMailSubject, DeliveryMailText, DeliverySmsText;
    Masternotifications.findOne({"templateType":"Email","templateName":"Order Delivered"})
                      .exec()
                      .then((maildata)=>{
                        DeliveryMailSubject = maildata.subject;
                        DeliveryMailText = maildata.content
                      })
                      .catch()

    Masternotifications.findOne({"templateType":"SMS","templateName":"Order Delivered"})
                      .exec()
                      .then((smsdata)=>{
                          var textcontent = smsdata.content;                              
                          var regex = new RegExp(/(<([^>]+)>)/ig);
                          var textcontent = smsdata.content.replace(regex, '');
                          textcontent   = textcontent.replace(/\&nbsp;/g, '');
                          DeliverySmsText = textcontent;
                      })
                      .catch()



    
    var status = req.body.status == "Delivered & Paid" ? "Paid" : "UnPaid";
    console.log(req.body.status);

    Orders.updateOne(
            { _id : req.body.orderID}, 
            {
                $push:{
                    deliveryStatus : [
                                        {
                                          status : req.body.status,
                                          Date   : new Date(), 
                                          userid : req.body.userid
                                        }
                                    ]             
                },
                status: status  
            }
            )
            .exec()
                .then(data=>{
                    // console.log(data);
                    if(data.nModified == 1){
                      if(status == 'Paid'){

                            request({
                             "method"    : "POST",
                             "url"       : "http://localhost:"+gloabalVariable.PORT+"/send-email",
                             "body"      :  {
                                                 "email"     : "amitrshinde156@gmail.com",
                                                 "subject"   : 'Order delivered Successfully',
                                                 "text"      : "WOW Its done",
                                                 "mail"      : 'Hello '+'Admin'+','+'\n'+"\n <br><br>Order delivered successfully."+"<b></b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team GangaExpress',
                                            },
                             "json"      : true,
                             "headers"   : {
                                             "User-Agent": "Test App"
                                         }
                            })
                            .then((sentemail)=>{
                                res.header("Access-Control-Allow-Origin","*");
                                res.status(200).json({message:"Mail Sent successfully"});
                            })
                            .catch((err) =>{
                                res.status(500).json({
                                    error: err
                                });
                            });
                           
                            const client2 = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                            const sourceMobile2 = "+919923393733";
                            var text2 = "Dear Admin, "+'\n'+"Order delivered successfully.\n";
                           
                            client2.messages.create(
                             src=sourceMobile2,
                             dst= '+919049711725',
                             text=text2
                            ).then((result)=> {
                                // console.log("src = ",src," | DST = ", dst, " | result = ", result);
                                res.status(200).json({
                                    message:"Order dilivered Successfully"
                                });
                            })
                            .catch(otpError=>{
                                // console.log("otpError",otpError);
                                return res.status(501).json({
                                     message: "Some Issue Occured While Placing Your Order",
                                     error: otpError
                                });
                            });


                            Orders.findOne({_id:req.body.orderID})
                            .exec()
                            .then(orderData =>{
                              User.findOne({_id : orderData.user_ID})
                              .exec()
                              .then(customerData =>{
                                      if(customerData){   
                                       request({
                                       "method"    : "POST",
                                       "url"       : "http://localhost:"+gloabalVariable.PORT+"/send-email",
                                       "body"      :   {
                                                           "email"     : customerData.profile.emailId,
                                                           "subject"   : DeliveryMailSubject,
                                                           "text"      : DeliveryMailSubject,
                                                           "mail"      : 'Hello '+customerData.profile.fullName+','+'\n'+"\n <br><br>"+DeliveryMailText+"<b></b>"+'\n'+'\n'+'<br><br>\nRegards,<br>Team GangaExpress',
                                                       },
                                       "json"      : true,
                                       "headers"   : {
                                                       "User-Agent": "Test App"
                                                   }
                                      })
                                      .then((sentemail)=>{
                                          res.header("Access-Control-Allow-Origin","*");
                                          res.status(200).json({message:"Mail Sent successfully"});
                                      })
                                      .catch((err) =>{
                                          res.status(500).json({
                                              error: err
                                          });
                                      });
                                     
                                      const client4 = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                                      const sourceMobile4 = "+919923393733";
                                      var text4 = DeliverySmsText;
                                     
                                      client4.messages.create(
                                       src=sourceMobile4,
                                       dst= '+91'+customerData.profile.mobileNumber,
                                       text=text4
                                      ).then((result)=> {
                                          // console.log("src = ",src," | DST = ", dst, " | result = ", result);
                                          res.status(200).json({
                                              message:"Order dilivered Successfully"
                                          });
                                      })
                                      .catch(otpError=>{
                                          return res.status(501).json({
                                               message: "Some Issue Occured While Delivering Your Order",
                                               error: otpError
                                          });
                                      }); 
                                    }
                                    
                                  })
                                  .catch(err =>{
                                      res.status(500).json({
                                          error: err
                                      });
                                  }); 

                            })
                            .catch(err =>{
                                res.status(500).json({
                                    error: err
                                });
                            });

                      }

                        res.status(200).json({
                            "message": "Order Status is updated Successfully."
                        });
                    }else{
                        res.status(401).json({
                            "message": "Order Not Found"
                        });
                    }
                })
                .catch(err =>{
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
};

exports.dispatchOrder = (req,res,next)=>{
    var dispatchMailSubject, dispatchMailText, dispatchSmsText;
    Masternotifications.findOne({"templateType":"Email","templateName":"Order Dispatched"})
                      .exec()
                      .then((maildata)=>{
                        dispatchMailSubject = maildata.subject;
                        dispatchMailText = maildata.content
                      })
                      .catch()

    Masternotifications.findOne({"templateType":"SMS","templateName":"Order Dispatched"})
                      .exec()
                      .then((smsdata)=>{ 
                          var textcontent = smsdata.content;                              
                          var regex = new RegExp(/(<([^>]+)>)/ig);
                          var textcontent = smsdata.content.replace(regex, '');
                          textcontent   = textcontent.replace(/\&nbsp;/g, '');                                                
                          dispatchSmsText = textcontent
                      })
                      .catch()
    // console.log(req.body.orderID);
    // console.log('businessAssociateId',req.body.businessAssociateId);
    Orders.updateOne(
            { _id : req.body.orderID}, 
            {
                $push:{
                    deliveryStatus  : [
                                        {
                                          status : "Dispatch",
                                          Date   : new Date(),
                                          userid : req.body.userid
                                        }
                                    ]
                },
                businessAssociate :  req.body.businessAssociateId
            }
            )
            .exec()
            .then(data=>{

                    BusinessAssociate.findOne({userID:req.body.businessAssociateId})
                    .exec()
                    .then(ba =>{
                            if(ba){   
                             request({
                             "method"    : "POST",
                             "url"       : "http://localhost:"+gloabalVariable.PORT+"/send-email",
                             "body"      :   {
                                                 "email"     : ba.emailID,
                                                 "subject"   : "You have a order to be delivered.",
                                                 "text"      : "You have a order to be delivered.",
                                                 "mail"      : 'Hello '+ba.companyName+','+'\n'+"\n <br><br>You have a order to be delivered.<b></b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team GangaExpress',
                                             },
                             "json"      : true,
                             "headers"   : {
                                             "User-Agent": "Test App"
                                         }
                            })
                            .then((sentemail)=>{
                                res.header("Access-Control-Allow-Origin","*");
                                res.status(200).json({message:"Mail Sent successfully"});
                            })
                            .catch((err) =>{
                                res.status(500).json({
                                    error: err
                                });
                            });
                           
                            const client3 = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                            const sourceMobile3 = "+919923393733";
                            var text3 = "Dear ba, "+'\n'+"You have a order to be delivered.\n";
                           
                            client3.messages.create(
                             src=sourceMobile3,
                             dst= '+91'+ba.mobileNo,
                             text=text3
                            ).then((result)=> {
                                // console.log("src = ",src," | DST = ", dst, " | result = ", result);
                                res.status(200).json({
                                    message:"Order dispached Successfully"
                                });
                            })
                            .catch(otpError=>{
                                // console.log("otpError",otpError);
                                return res.status(501).json({
                                     message: "Some Issue Occured While Placing Your Order",
                                     error: otpError
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
                    if(data.nModified == 1){
                    
                    // send notification to customer
                    Orders.findOne({_id:req.body.orderID})
                    .exec()
                    .then(orderData =>{
                      User.findOne({_id : orderData.user_ID})
                      .exec()
                      .then(customerData =>{
                              if(customerData){   
                               request({
                               "method"    : "POST",
                               "url"       : "http://localhost:"+gloabalVariable.PORT+"/send-email",
                               "body"      :   {
                                                   "email"     : customerData.profile.emailId,
                                                   "subject"   : dispatchMailSubject,
                                                   "text"      : dispatchMailSubject,
                                                   "mail"      : 'Hello '+customerData.profile.fullName+','+'\n'+"\n <br><br>"+dispatchMailText+"<b></b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team GangaExpress',
                                               },
                               "json"      : true,
                               "headers"   : {
                                               "User-Agent": "Test App"
                                           }
                              })
                              .then((sentemail)=>{
                                  res.header("Access-Control-Allow-Origin","*");
                                  res.status(200).json({message:"Mail Sent successfully"});
                              })
                              .catch((err) =>{
                                  res.status(500).json({
                                      error: err
                                  });
                              });
                             
                              const client4 = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                              const sourceMobile4 = "+919923393733";
                              var text4 = dispatchSmsText;
                              client4.messages.create(
                               src=sourceMobile4,
                               dst= '+91'+customerData.profile.mobileNumber,
                               text=text4
                              ).then((result)=> {
                                  // console.log("src = ",src," | DST = ", dst, " | result = ", result);
                                  res.status(200).json({
                                      message:"Order dispached Successfully"
                                  });
                              })
                              .catch(otpError=>{
                                  return res.status(501).json({
                                       message: "Some Issue Occured While Placing Your Order",
                                       error: otpError
                                  });
                              }); 
                            }
                            
                          })
                          .catch(err =>{
                              res.status(500).json({
                                  error: err
                              });
                          }); 

                    })
                    .catch(err =>{
                        res.status(500).json({
                            error: err
                        });
                    });
                        res.status(200).json({
                            "message": "Order is dispatched successfully."
                        });
                    }else{
                        res.status(401).json({
                            "message": "Order Not Found"
                        });
                    }



                })
                .catch(err =>{
                    // console.log('err2');
                    res.status(500).json({
                        error: err
                    });
                });
};


exports.list_order_by_user = (req,res,next)=>{
    Orders.find({user_ID:req.params.user_ID}).sort({createdAt:-1})      
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

exports.cancelOrder = (req,res,next)=>{
     Orders.updateOne(
            { _id : req.body.orderID}, 
            {
                $push:{
                    deliveryStatus : [
                                        {
                                          status : 'Cancelled',
                                          Date   : new Date(),
                                          userid : req.body.userid
                                        }
                                    ]
                }
            }
            )
            .exec()
                .then(data=>{
                    // console.log(data);
                    if(data.nModified == 1){
                        res.status(200).json({
                            "message": "Order is cancelled Successfully."
                        });
                    }else{
                        res.status(401).json({
                            "message": "Order Not Found"
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

exports.returnOrder = (req,res,next)=>{ 
     Orders.updateOne(
            { _id : req.body.orderID, "products.product_ID":req.body.productID}, 
            {
                $set:{
                    products : [
                                        {
                                          status : 'Returned',
                                          Date   : new Date(),
                                          userid : req.body.userid
                                        }
                                    ]
                }
            }
            )
            .exec()
                .then(data=>{
                    // console.log(data);
                    if(data.nModified == 1){
                        res.status(200).json({
                            "message": "Order is returned Successfully."
                        });
                    }else{
                        res.status(401).json({
                            "message": "Order Not Found"
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

exports.get_reports = (req,res,next)=>{
    Orders.find({}).sort({createdAt:-1})      
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
