const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
	createdAt	: {type:Date},
	services	: {
		password:{
					bcrypt:String
				  },
		resume: {
			loginTokens:[
				{
					when: Date,
					hashedToken : String
				}
			]
		}
	},
	username	 : {type:String},
	emails		 : [
							{
								address:{type:String},
								verified: Boolean
							}
					],
	mobileNumber  : String,
	countryCode   : String,
	profile :{
		firstName 		: String,
		lastName  		: String,
		fullName  		: String,
		emailId   		: String,
		mobileNumber 	: String, 
		profileImage 	: String,
		pwd 			: String,
		status			: String,
		otp 			: Number,
		sentMobOtp 	  	: Number,
		sentEmailOtp  	: Number,
		receiveMobOtp 	: Number,
		receiveEmailOtp : Number
	},
	deliveryAddress 	  : [{
		"name"            : String,
		"email"           : String,
		"addressLine1"    : String,
		"addressLine2"    : String,
		"pincode"         : String,
		"block" 	      : String,
		"city"            : String,
		"state"           : String,
		"country" 		  : String,
		"mobileNumber"    : String,
		"addType"         : String,
	}],
	userAddress 		: Object,
	roles 				: [String],
	officeLocation 		: String,
	heartbeat 			: Date
});

module.exports = mongoose.model('users',userSchema);
