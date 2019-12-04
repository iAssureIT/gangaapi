const mongoose	        = require("mongoose");
const Preference   = require('../models/preference');


exports.create_preference = (req, res, next) => {
	Preference.findOne({taxName     : req.body.taxName})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Tax Name is already exists'
				});
			}else{
            const preference = new Preference({
                _id             : mongoose.Types.ObjectId(),      
                taxName         : req.body.taxName
            });
            
            preference.save(
                function(err){
                    if(err){
                        return  res.status(500).json({
                            error: err
                        });          
                    }else{
                        res.status(200).json({ 
                            message: 'New preference created!',
                            data: preference
                        });
                    }
                }
            );
        }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.list_preference = (req, res, next)=>{
    Preference.find()
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
}
exports.count_preference = (req, res, next)=>{
    Preference.find().count()
    .exec()
    .then(data=>{
        res.status(200).json({"dataCount": data});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });         
}
exports.one_preference = (req, res, next)=>{
    Preference.findOne({_id : req.params.preferenceID})
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
exports.update_vendor_category = (req,res,next)=>{
    Preference.updateOne(
            { _id:req.body.preferenceID},  
            {
                $set:{
                    taxName         : req.body.taxName,
                    createdAt       : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Tax Name Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Tax Name Not Found"
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