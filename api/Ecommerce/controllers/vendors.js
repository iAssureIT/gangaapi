const mongoose	= require("mongoose");

const Vendors = require('../models/vendors');

exports.insert_vendor = (req,res,next)=>{
	Vendors.find()
		.exec()
		.then(data =>{
			const vendors = new Vendors({
                _id                       : new mongoose.Types.ObjectId(),                    
                typeOptions               : req.body.typeOptions,
                companyName               : req.body.companyName,
                pan                       : req.body.pan,
                tin                       : req.body.tin,
                website                   : req.body.website,
                gstno                     : req.body.gstno,
                category                  : req.body.category,
                coino                     : req.body.coino,
                mfg                       : req.body.mfg,
                score                     : req.body.score,
                evaluation                : req.body.evaluation,
                logo                      : req.body.logo,
                attachedDocuments         : req.body.attachedDocuments,
                locationDetails           : req.body.locationDetails,
                contactDetails            : req.body.contactDetails,
                productsServices          : req.body.productsServices,
                vendorID                 : req.body.vendorID,
                owner_ID                  : req.body.owner_ID,
                createdAt                 : new Date()
            });
            vendors.save()
            .then(data=>{
                res.status(200).json({
                    "message": "Vendor Submitted Successfully.",
                    "vendor_ID" : data._id
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
};
exports.update_vendor = (req,res,next)=>{
    Vendors.updateOne(
            { _id:req.body.vendor_ID},  
            {
                $set:{
                    typeOptions               : req.body.typeOptions,
                    companyName               : req.body.companyName,
                    pan                       : req.body.pan,
                    tin                       : req.body.tin,
                    website                   : req.body.website,
                    gstno                     : req.body.gstno,
                    category                  : req.body.category,
                    coino                     : req.body.coino,
                    mfg                       : req.body.mfg,
                    score                     : req.body.score,
                    Evaluation                : req.body.Evaluation,
                    logo                      : req.body.logo,
                    attachedDocuments         : req.body.attachedDocuments,
                    locationDetails           : req.body.locationDetails,
                    contactDetails            : req.body.contactDetails,
                    productsServices          : req.body.productsServices,
                    vendorID                 : req.body.vendorID,
                    Owner_ID                  : req.body.Owner_ID,
                    createdAt                 : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Vendor Updated Successfully.",
                    "vendor_ID" : data._id
                });
            }else{
                res.status(401).json({
                    "message": "Vendor Not Found"
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
exports.list_vendor = (req,res,next)=>{
    Vendors.find()       
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
exports.insert_vendor_location = (req,res,next)=>{
    console.log('req', req.params, req.body);
    Vendors.updateOne(
        { _id:req.params.vendorID},  
        {
            $push:{
                locationDetails           : req.body,
            }
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({
                "message": "Vendor's location submitted successfully.",
                "vendor_ID" : data._id
            });
        }else{
            res.status(401).json({
                "message": "Vendor Not Found"
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
exports.insert_vendor_contact = (req,res,next)=>{
    console.log('req', req.params, req.body);
    Vendors.updateOne(
        { _id:req.params.vendorID},  
        {
            $push:{
                contactDetails           : req.body,
            }
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({
                "message": "Vendor's contact submitted successfully.",
                "vendor_ID" : data._id
            });
        }else{
            res.status(401).json({
                "message": "Vendor Not Found"
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
exports.list_vendor_with_limits = (req,res,next)=>{
    Vendors.find()
    .exec()
    .then(data=>{
        // var allData = data.map((x, i)=>{
        //     return {
        //         "_id"                   : x._id,
        //         "vendorCode"           : x.vendorCode,
        //         "vendorName"           : x.vendorName,
        //         "featured"              : x.featured,
        //         "exclusive"             : x.exclusive,
        //         "status"                : x.status
        //     }
        // })
        res.status(200).json(data.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.count_vendor = (req,res,next)=>{
    Vendors.find({})
    .exec()
    .then(data=>{
        // var allData = data.map((x, i)=>{
        //     return {
        //         "_id"                   : x._id,
        //         "vendorCode"           : x.vendorCode,
        //         "vendorName"           : x.vendorName,
        //         "featured"              : x.featured,
        //         "exclusive"             : x.exclusive,
        //         "status"                : x.status
        //     }
        // })
        res.status(200).json({"dataCount":data});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_vendor = (req,res,next)=>{
    Vendors.find({_id : req.params.vendorID})
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
exports.delete_vendor = (req,res,next)=>{
    Vendors.deleteOne({_id:req.params.vendorID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message": "Vendor Deleted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};