const mongoose			= require("mongoose");
const bcrypt			= require("bcrypt");
const jwt				= require("jsonwebtoken");
const plivo 			= require('plivo');
const User 				= require('../models/users');
var request 			= require('request-promise');
const gloabalVariable 	= require('./../../../nodemon'); 
const Masternotifications =  require('../models/masternotifications');
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.user_signupadmin = (req,res,next)=>{
    var mailSubject, mailText, smsText;
    Masternotifications.findOne({"templateType":"Email","templateName":"Order Placed Successfully"})
                      .exec()
                      .then((maildata)=>{
                        console.log("maildata---->",maildata);
                        console.log("maildata--In-->");
                        mailSubject = maildata.subject;
                        mailText = maildata.content
                      })
                      .catch()
	User.find()
		.exec()
		.then(user =>{
				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}else{
						const OTP = getRandomInt(1000,9999);
						const MailOTP = getRandomInt(100000,999999);
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							createdAt		: new Date,
							services		: {
								password	:{
											bcrypt:hash
											},
							},
							mobileNumber  	: req.body.mobileNumber,
							emails			: [
									{
										address  : req.body.emailId,
										verified : true 
									}
							],
							profile		:{
										firstName     : req.body.firstName,
										lastName      : req.body.lastName,
										fullName      : req.body.firstName+' '+req.body.lastName,
										emailId       : req.body.emailId,
										mobileNumber  : req.body.mobileNumber,
										status		  : req.body.status,
										sentMobOtp 	  : OTP,
										sentEmailOtp  : MailOTP 
							},
							roles 		   : (req.body.roles),
							username 	   : req.body.emailId,
							
			            });	
						user.save()
                        .then(newUser =>{
                            if(newUser){
                                
                                console.log('New USER = ',newUser);
                               
                                
                                request({
                                    
                                 "method"    : "POST",
                                 "url"       : "http://localhost:"+gloabalVariable.PORT+"/send-email",
                                 "body"      :   {
                                                     "email"     : newUser.profile.emailId,
                                                     "subject"   : mailSubject,
                                                     // "subject"   : 'Verify your Account',
                                                     // "text"      : "WOW Its done",
                                                     // "text"      : "WOW Its done",
                                                     "mail"      : 'Hello '+newUser.profile.fullName+','+'\n'+mailText+"\n <br><br>Your account verification code is "+"<b>"+MailOTP+"</b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team GangaExpress',
                                                 },
                                 "json"      : true,
                                 "headers"   : {
                                                 "User-Agent": "Test App"
                                             }
                                })
                            
                                .then((sentemail)=>{
                                 console.log("call to api");
                                res.header("Access-Control-Allow-Origin","*");    

                                 res.status(200).json({message:"Mail Sent successfully"});
                                })
                                .catch((err) =>{
                                 console.log("call to api",err);
                                 res.status(500).json({
                                     error: err
                                 });
                                });
                                
                                
                                console.log('Plivo Client = ');
                                const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                                const sourceMobile = "+919923393733";
                                var text = "Dear User, "+'\n'+"To verify your account on GangaExpress, Enter this verification code : \n"+OTP;
                                
                                client.messages.create(
                                 src=sourceMobile,
                                 dst= '+91'+req.body.mobileNumber,
                                 text=text
                                ).then((result)=> {
                                 console.log("src = ",src," | DST = ", dst, " | result = ", result);
                                 // return res.status(200).json("OTP "+OTP+" Sent Successfully ");
                                 return res.status(200).json({
                                     "message" : 'NEW-USER-CREATED',
                                     "user_id" : newUser._id,
                                     "otp"     : OTP,
                                     "mailotp" : MailOTP
                                 });         
                                })
                                .catch(otpError=>{
                                 return res.status(501).json({
                                     message: "Some Error Occurred in OTP Send Function",
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
					}			
				});
			
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.add_user_address = (req,res,next)=>{
	// var roleData = req.body.role;
	console.log("req.params.userID",req.params.userID, req.body);

    User.updateOne(
            { _id:req.params.userID},  
            {
                $set:{
					"profile.firstName"     				: req.body.firstName,
					"profile.lastName"      				: req.body.lastName,
					"profile.fullName"      				: req.body.firstName+' '+req.body.lastName,
					"profile.emailId"       				: req.body.emailId,
					"profile.mobileNumber"  				: req.body.mobileNumber,
					"profile.profileImage"  				: req.body.profileImage,
					"profile.deliveryAdd.0.name"            : req.body.firstName+' '+req.body.lastName,
					"profile.deliveryAdd.0.email"           : req.body.emailId,
					"profile.deliveryAdd.0.addressLine1"    : req.body.addressLine1,
					"profile.deliveryAdd.0.addressLine2"    : req.body.addressLine2,  
					"profile.deliveryAdd.0.pincode"         : req.body.pincode,
					"profile.deliveryAdd.0.block"           : req.body.block,
					"profile.deliveryAdd.0.country"         : req.body.country,
					"profile.deliveryAdd.0.city"            : req.body.city,
					"profile.deliveryAdd.0.state"           : req.body.state,
					"profile.deliveryAdd.0.mobileNumber"    : req.body.mobileNumber,
					"profile.deliveryAdd.0.addType"         : req.body.addType, 
				}
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            res.status(200).json("User Updated");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.ba_signupadmin = (req,res,next)=>{
	User.find()
		.exec()
		.then(user =>{
				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}else{
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							createdAt		: new Date,
							services		: {
								password	:{
											bcrypt:hash
											},
							},
							mobileNumber  	: req.body.mobileNumber,
							emails			: [
									{
										address  : req.body.emailId,
										verified : true 
									}
							],
							profile		:{
										firstName     : req.body.companyName,
										lastName      : req.body.companyName,
										fullName      : req.body.companyName,
										emailId       : req.body.emailId,
										mobileNumber  : req.body.mobileNumber,
										status		  : req.body.status,
										// center_ID	  : req.body.center_ID,
										// centerName	  : req.body.centerName,
							},
							username 	   : req.body.emailId,
							roles 		   : (req.body.roles),
							
			            });	
						user.save()
                        .then(newUser =>{
                            if(newUser){
                            	res.status(200).json({
									message: "BA added successfully",
									user:newUser
								});
                                console.log('New USER = ',newUser);
                            }
                        }) 	
                        .catch(err =>{
								console.log(err);
								res.status(500).json({
									error: err
								});
						});
					}			
				});
			
		})
};
exports.resendotp = (req,res,next)=>{
	console.log('req.params.userID', req.params.userID);
	User.findOne({_id:req.params.userID})
		.exec()
		.then(user =>{
			console.log('user',user);
							const OTP = getRandomInt(1000,9999);
							const MailOTP = getRandomInt(100000,999999);
                            if(user){
                            	console.log('user.profile.mobileNumber', user.profile.mobileNumber);
                                request({
                                    
                                 "method"    : "POST",
                                 "url"       : "http://localhost:3060/send-email",
                                 "body"      :   {
                                                     "email"     : user.profile.emailId,
                                                     "subject"   : 'Verify your Account',
                                                     "text"      : "WOW Its done",
                                                     "mail"      : 'Hello '+user.profile.fullName+','+'\n'+"\n <br><br>Your account verification code is "+"<b>"+MailOTP+"</b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team GangaExpress',
                                                 },
                                 "json"      : true,
                                 "headers"   : {
                                                 "User-Agent": "Test App"
                                             }
                                })
                            
                                .then((sentemail)=>{
                                 console.log("call to api");
                                res.header("Access-Control-Allow-Origin","*");    

                                 res.status(200).json({message:"Mail Sent successfully"});
                                })
                                .catch((err) =>{
                                 // console.log("call to api",err);
                                 res.status(500).json({
                                     error: err
                                 });
                                });
                                
                                
                                // console.log('Plivo Client = ');
                                const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                                const sourceMobile = "+919923393733";
                                var text = "Dear User, "+'\n'+"To verify your account on GangaExpress, Enter this verification code : \n"+OTP;
                                
                                client.messages.create(
                                 src=sourceMobile,
                                 dst= '+91'+user.profile.mobileNumber,
                                 text=text
                                ).then((result)=> {
                                 console.log("src = ",src," | DST = ", dst, " | result = ", result);
	                                User.updateOne(
								            { _id:req.params.userID},  
								            {
								                $set:{
												
													"profile.sentMobOtp":OTP,
													"profile.sentEmailOtp":MailOTP,					
																		
													},												
								            }
								        )
	                                 .exec()
							        .then(data=>{
							                res.status(200).json({
							                	message:"OTP Resend Successfully"
							                });
							         })
							        .catch(err =>{
							            console.log(err);
							            res.status(500).json({
							                error: err
							            });
									});
                                 // return res.status(200).json("OTP "+OTP+" Sent Successfully ");
                                })
                                .catch(otpError=>{
                                	console.log("otpError",otpError);
                                 return res.status(501).json({
                                     message: "Some Error Occurred in Resending OTP Send Function",
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
};
exports.update_user_resetpassword = (req,res,next)=>{
	// var roleData = req.body.role;
	bcrypt.hash(req.body.pwd,10,(err,hash)=>{
    User.updateOne(
            { _id:req.params.userID},  
            {
                $set:{
				
					services		: {
										password:{
												bcrypt:hash
												},
					},

					
					}			
				
            }
        )
        .exec()
        .then(data=>{
            // console.log('data ',data);
            if(data.nModified == 1){
				// console.log('data =========>>>',data);
                res.status(200).json("Password  Updated");
            }else{
                res.status(401).json("Password  Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
		});
	});
};
exports.user_login = (req,res,next)=>{
    console.log('login');
    User.findOne({username:req.body.email})
        .exec()
        .then(user => {
            if(user){
                var pwd = user.services.password.bcrypt;
                if(pwd){
					console.log('PWD');
                    bcrypt.compare(req.body.password,pwd,(err,result)=>{
                    	console.log(result);
                        if(err){
                            res.status(401).json({
                                message: 'Bcrypt Auth failed'
                            });     
                        }
                        if(result){
                            const token = jwt.sign({
                                email   : req.body.email,
                                userId  : user._id ,
                            },gloabalVariable.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                            );
                            console.log('login faild');
                            res.header("Access-Control-Allow-Origin","*");
                             res.status(200).json({
                                message             : 'Auth successful',
                                token               : token,
                                user_ID             : user._id,
								userFirstName       : user.profile.firstname,
								roles 				: user.roles,
                            }); 
                        }
                        console.log({message:"Neither err nor result"});
                        res.status(401).json({
                            message: 'Error and Result Auth failed'
                        });
                    })
                }else{
                    res.status(401).json({message:"Password not found"}); 
                }
            }else{
                res.status(401).json({message:"User Not found"});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_list = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
		.exec()
		.then(users =>{
			console.log('users ',users);
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	
};
exports.users_directlist = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
	.select("_id username roles createdAt profile.firstName profile.lastName profile.mobNumber profile.fullname profile.emailId profile.status ")
		
	   .exec()
	   .then(users =>{
		   var userdataarr = [];
		   users.map((data, index)=>{
			// console.log('data =======================>>>>>>>>>>>>',data);

			// console.log("data_id", data._id);
			   	userdataarr.push({
				   id            : data._id,
				   createdAt	 : data.createdAt,
				   username 	 : data.username,
				   mobNumber     : data.profile.mobNumber,
				   
				   firstName     : data.profile.firstName,
				   lastName      : data.profile.lastName,
				   fullName      : data.profile.name,
				   emailId       : data.profile.emailId,
				   status	     : data.profile.status,
				   roles 		 : data.roles,
				   // centerName 	 : data.centerName,
				   // center_ID     : data.center_ID
			   
				});	
		   })
		   console.log('userdataarr ',userdataarrs.length);
		   if(userdataarr.length == users.length){
			res.status(200).json(userdataarr);
		   }
		   
	   })
	   .catch(err =>{
		   console.log(err);
		   res.status(500).json({
			   error: err
		   });
	   });
   
};
exports.users_fetch = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
		.sort( { createdAt: -1 } )
		.select("_id username createdAt profile roles officeLocation")
		.exec()
		.then(users =>{			
			console.log("fetch users = ",users);
			var userdataarr = []
			users.map((data, index)=>{
				userdataarr.push({
					_id 		: data._id,
					createdAt	: data.createdAt,
					username	: data.username,					
					mobileNumber   : data.profile.mobileNumber,				
					firstName   : data.profile.firstName,
					lastName    : data.profile.lastName,
					fullName    : data.profile.fullName,
					emailId     : data.profile.emailId,
					status	    : data.profile.status,
					roles 	    : (data.roles).toString(),
					officeLocation 	: data.officeLocation,
				});	
			})
			console.log('userdataarr ',userdataarr);
			res.status(200).json(userdataarr.slice(req.body.startRange, req.body.limitRange));
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	
};

exports.user_details = (req, res, next)=>{
	var id = req.params.userID;
	User.findOne({_id:id})
		// .select("profile")
		.exec()
		.then(users =>{
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
// Handle delete contact
exports.delete_user = function (req, res,next) {
    User.deleteOne({
        _id: req.params.userID
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'Users deleted'
        });
    });
};

exports.deleteall_user = function (req, res,next) {
    User.deleteMany({
       
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'All Users deleted'
        });
    });
};


exports.update_user = (req,res,next)=>{
	// var roleData = req.body.role;
	console.log("req.params.userID",req.params.userID);
	console.log("req.BODY+++=======+>",req.body);

    User.updateOne(
            { _id:req.params.userID},  
            {
                $set:{
					"profile.firstName"     : req.body.firstName,
					"profile.lastName"      : req.body.lastName,
					"profile.fullName"      : req.body.firstName+' '+req.body.lastName,
					"profile.emailId"       : req.body.emailId,
					"profile.mobileNumber"  : req.body.mobileNumber,
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				console.log('data =========>>>',data);
                res.status(200).json("User Updated");
            }else{
                res.status(401).json("User Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.user_change_role = (req,res,next)=>{
	User.findOne({_id:req.params.userID})
		.exec()
		.then(user=>{
			if(user){
				if(req.params.rolestatus == 'assign'){
					User.updateOne(
						{_id:req.body.userID},
						{
							$push:{
								roles : req.body.role
							}
						}
					)
					.exec()
					.then(data=>{
						res.status(200).json("Role Assigned");
					})
					.catch(err =>{
						console.log('user error ',err);
						res.status(500).json({
							error: err
						});
					});
				}else if(req.params.rolestatus == 'remove'){
					User.updateOne(
						{_id:req.body.userID},
						{
							$pull:{
								roles : req.body.role
							}
						}
					)
					.exec()
					.then(data=>{
						res.status(200).json("Role Removed");
					})
					.catch(err =>{
						console.log('user error ',err);
						res.status(500).json({
							error: err
						});
					});
				}
				console.log('user ',user);
			}else{
				res.status(404).json("User Not Found");
			}
		})
		.catch(err=>{
			console.log('update user error ',err);
			res.status(500).json({
				error:err
			});
		});
};

//=============================




exports.account_status= (req,res,next)=>{

	User.updateOne(
		{'_id': req.body.userID },
		{
			$set:{
				"profile.status": req.body.status ,
			} //End of set
		}
	)
	.exec()
	.then( data =>{
		
		return res.status(200).json({
			"message" : 'Status-Updated',
		});		
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
};

exports.account_role_add= (req,res,next)=>{
	
	User.findOne({roles: req.body.roles})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Role is already exists'
				});
			}else{
				User.updateOne(
					{'_id': req.body.userID },
					{
						$push:{
							"roles": req.body.roles ,
						} //End of set
					}
				)
	
				.exec()
				.then( data =>{
					if(data){
					return res.status(200).json({
						"message" : 'Roles-Updated',
						// "data"    : data
					});		
					}else{
						return res.status(404).json({
							"message" : 'Roles-Not-Updated',
						
						});	
					}
				})
			}
        })
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
};
exports.users_count = (req,res,next)=>{
    User.find({roles : {$ne : "admin"}}).count()
    .exec()
    .then(data=>{
        
        res.status(200).json({"dataCount":data});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.account_role_remove= (req,res,next)=>{

	User.updateOne(
		{'_id': req.body.userID },
		{
			$pull:{
				"roles": req.body.roles ,
			} //End of set
		}
	)
	
	.exec()
	.then( data =>{
		if(data){
		return res.status(200).json({
			"message" : 'Roles-Deleted',
			"data"    : data
		});		
		}else{
			return res.status(200).json({
				"message" : 'Roles-Not-Deleted',
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


exports.user_search = (req,res,next)=>{
	// console.log("req.body.searchText",req.body.searchText);

	User.find(
		{$or:[
			{"profile.fullName"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.firstName"	:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.lastName"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.emailId"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.mobileNumber"	:	{ "$regex": req.body.searchText, $options: "i"}},
			// {"roles"				:	{ "$regex": { $in: [req.body.searchText] }, $options: "i"}},
			{"roles"				:	{ $in: [req.body.searchText] }},
			{"profile.status"		:	{ "$regex": req.body.searchText, $options: "i"}},
		]},
		
	)
	.exec()
	.then( data =>{
		console.log('data ',data);
		if(data.length > 0){
			return res.status(200).json({
				"message" : 'Search-Successfull',
					"data": data
			});		
		}else{
			return res.status(404).json({
				"message" : 'No-Data-Available',		
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

exports.search_user_office = (req,res,next)=>{
	// console.log("req.body.searchText",req.body.searchText);

	User.find(
		{$or:[
			{"officeLocation"		:	{ "$regex": req.body.searchText, $options: "i"}},
			
		]},
		
	)
	.exec()
	.then( data =>{
		console.log('data ',data);
		if(data.length > 0){
			return res.status(200).json({
				"message" : 'Search-Successfull',
					"data": data
			});		
		}else{
			return res.status(404).json({
				"message" : 'No-Data-Available',		
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

exports.add_delivery_address = (req, res, next)=>{
	User.updateOne(
		{'_id': req.body.user_ID},
		{
		  $push: {
				"profile.deliveryAdd" : {
					"name"            : req.body.name,
					"email"           : req.body.email,
					"addressLine1"    : req.body.addressLine1,
					"addressLine2"    : req.body.addressLine2,  
					"pincode"         : req.body.pincode,
					"block"           : req.body.block,
					"city"            : req.body.city,
					"state"           : req.body.state,
					"country"         : req.body.country,
					"mobileNumber"    : req.body.mobileNumber,
					"addType"         : req.body.addType,     
				}
		  	}  
	})
	.exec()
	.then(data=>{
		if(data.nModified == 1){
			res.status(200).json({
				"message": "Address added successfully."
			});
		}else{
			res.status(401).json({
				"message": "User Not Found"
			});
		}
	})
	.catch(error=>{
		console.log(error);
		res.status(500).json({
			error: error
		});
	})	
};

exports.confirm_otps = (req, res, next)=>{
	console.log('req', req.body);
	User.findOne({"_id": req.body.user_ID})
	.exec()
	.then(data=>{
		// console.log('data', data);
		if(req.body.mobOTP === data.profile.sentMobOtp && req.body.emailOTP === data.profile.sentEmailOtp){
			console.log('sucess');
			User.updateOne(
				{"_id": req.body.user_ID},
				{
					$set:{
						'profile.receiveMobOtp' 	: req.body.mobOTP,
						'profile.receiveEmailOtp'   : req.body.emailOTP
					}
				}
			)
			.exec()
			.then(datas=>{
				res.status(200).json({
					"message": "OTP Verified Successfully."
				});
			})
			.catch(error=>{
				res.status(200).json({
					"message": "Please enter correct OTP or try regenerating the OTP."
				});
			})
		}else{
			res.status(200).json({
				"message": "Please enter correct OTP or try regenerating the OTP."
			});
		}
		
	})
	.catch(error=>{
		console.log(error);
		res.status(500).json({
			error: error
		});
	})
};