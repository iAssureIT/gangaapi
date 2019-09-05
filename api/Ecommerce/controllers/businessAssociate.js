const mongoose	= require("mongoose");

const BusinessAssociate = require('../models/businessAssociate');

exports.insert_ba = (req,res,next)=>{
    console.log(req.body.locationDetails);
    var locationArray = [];

	const BA = new BusinessAssociate({
        _id                       : new mongoose.Types.ObjectId(),
        companyName               : req.body.companyName,
        emailID                   : req.body.emailID,
        mobileNo                  : req.body.mobileNo,
        pan                       : req.body.pan,
        website                   : req.body.website,
        gstno                     : req.body.gstno,
        logo                      : req.body.logo,
        locationDetails           : [],
        contactDetails            : [], 
        createdAt                 : new Date(),
        createdBy                 : req.body.createdBy,
        userID                    : req.body.userID
    });
    BA.save()
    .then(data=>{
        res.status(200).json({
            "id"     : data._id,
            "message": "Business Associate Submitted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        }); 
    });
};

exports.update_ba = (req,res,next)=>{
    console.log('data',req.body);
    BusinessAssociate.updateOne(
            { _id:req.body.baID},  
            {
                $set:   { 
                            'companyName'              : req.body.companyName,
                            'emailID'                  : req.body.emailID,
                            'mobileNo'                 : req.body.mobileNo,
                            'pan'                      : req.body.pan,
                            'website'                  : req.body.website,
                            'gstno'                    : req.body.gstno,
                            'logo'                     : req.body.logo
                        }
            }
        )
        .exec()
        .then(data=>{
            console.log(data)
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Business Associate Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Business Associate Not Found"
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


exports.update_ba_loc = (req,res,next)=>{
    var locationdetails = req.body.locationDetails;
    BusinessAssociate.updateOne(
            { _id:req.body.baID},  
            {
                $push:  { 'locationDetails' : locationdetails }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Business Associate Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Business Associate Not Found"
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

exports.singleLocation = (req,res,next)=>{
    
    BusinessAssociate.find({"_id" : req.body.baID, "locationDetails._id":req.body.locationID },
        {"locationDetails.$" : 1})
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


exports.singleContact = (req,res,next)=>{
    
    BusinessAssociate.find({"_id" : req.body.baID, "contactDetails._id":req.body.contactID },
        {"contactDetails.$" : 1})
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
exports.update_ba_loc_one = (req,res,next)=>{
    var locationdetails = req.body.locationDetails;
    
    BusinessAssociate.updateOne(
            { "_id":req.body.baID, "locationDetails._id": req.body.locationID},  
            {
                $set:   { 'locationDetails.$.addressLine1' : locationdetails[0].addressLine1,
                          'locationDetails.$.addressLine2' : locationdetails[0].addressLine2,
                          'locationDetails.$.countryCode'  : locationdetails[0].countryCode,
                          'locationDetails.$.stateCode'    : locationdetails[0].stateCode,
                          'locationDetails.$.district'     : locationdetails[0].district,
                          'locationDetails.$.city'         : locationdetails[0].city,
                          'locationDetails.$.area'         : locationdetails[0].area,
                          'locationDetails.$.pincode'    : locationdetails[0].pincode,
                          
                        }
            }
        )
        .exec()
        .then(data=>{
            console.log(data);
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Business Associate Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Business Associate Not Found"
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

exports.update_ba_contact_one = (req,res,next)=>{
    var contactDetails = req.body.contactDetails;

    BusinessAssociate.updateOne(
            { "_id":req.body.baID, "contactDetails._id": req.body.contactID},  
            {
                $set:   { 'contactDetails.$.name'              : contactDetails[0].name,
                          'contactDetails.$.mobileNo'          : contactDetails[0].mobileNo,
                          'contactDetails.$.email'             : contactDetails[0].email,
                          'contactDetails.$.altMobileno'       : contactDetails[0].altMobileno,
                          'contactDetails.$.officeLandlineNo'  : contactDetails[0].officeLandlineNo   
                        }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Business Associate Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Business Associate Not Found"
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
exports.update_ba_contact = (req,res,next)=>{
    var contactdetails = req.body.contactDetails;

    BusinessAssociate.updateOne(
            { _id:req.body.baID},  
            {
                $push:  { 'contactDetails' : contactdetails }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Business Associate Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Business Associate Not Found"
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


exports.list_ba = (req,res,next)=>{
    BusinessAssociate.find()       
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

exports.single_ba = (req,res,next)=>{
    BusinessAssociate.find({_id : req.params.baID})
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
exports.delete_ba = (req,res,next)=>{
    BusinessAssociate.deleteOne({_id:req.params.baID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message": "Business Associate Deleted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


exports.delete_location = (req,res,next)=>{   
    BusinessAssociate.updateOne(
            { _id:req.params.baID},  
            {
                $pull: { 'locationDetails' : {_id:req.params.locationID}}
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Business Associate Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Business Associate Not Found"
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

exports.delete_contact = (req,res,next)=>{   
    BusinessAssociate.updateOne(
            { _id:req.params.baID},  
            {
                $pull: { 'contactDetails' : {_id:req.params.contactID}}
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Business Associate Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Business Associate Not Found"
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
