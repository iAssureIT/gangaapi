const mongoose = require("mongoose");

const Vendors = require('../models/vendors');

exports.insert_vendor = (req, res, next) => {
    Vendors.find()
        .exec()
        .then(data => {
            const vendors = new Vendors({
                _id: new mongoose.Types.ObjectId(),
                typeOptions: req.body.typeOptions,
                companyName: req.body.companyName,
                pan: req.body.pan,
                tin: req.body.tin,
                website: req.body.website,
                gstno: req.body.gstno,
                category: req.body.category,
                coino: req.body.coino,
                mfg: req.body.mfg,
                score: req.body.score,
                evaluation: req.body.evaluation,
                logo: req.body.logo,
                attachedDocuments: req.body.attachedDocuments,
                locationDetails: req.body.locationDetails,
                contactDetails: req.body.contactDetails,
                productsServices: req.body.productsServices,
                vendorID: req.body.vendorID,
                owner_ID: req.body.owner_ID,
                createdAt: new Date()
            });
            vendors.save()
                .then(data => {
                    res.status(200).json({
                        "message": "Vendor Submitted Successfully.",
                        "vendor_ID": data._id
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.update_vendor = (req, res, next) => {
    Vendors.updateOne(
        { _id: req.body.vendor_ID },
        {
            $set: {
                typeOptions: req.body.typeOptions,
                companyName: req.body.companyName,
                pan: req.body.pan,
                tin: req.body.tin,
                website: req.body.website,
                gstno: req.body.gstno,
                category: req.body.category,
                coino: req.body.coino,
                mfg: req.body.mfg,
                score: req.body.score,
                Evaluation: req.body.Evaluation,
                logo: req.body.logo,
                attachedDocuments: req.body.attachedDocuments,
                locationDetails: req.body.locationDetails,
                contactDetails: req.body.contactDetails,
                productsServices: req.body.productsServices,
                vendorID: req.body.vendorID,
                Owner_ID: req.body.Owner_ID,
                createdAt: new Date()
            }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                res.status(200).json({
                    "message": "Vendor Updated Successfully.",
                    "vendor_ID": data._id
                });
            } else {
                res.status(401).json({
                    "message": "Vendor Not Found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.list_vendor = (req, res, next) => {
    Vendors.find()
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
exports.insert_vendor_location = (req, res, next) => {
    console.log('req', req.params, req.body);
    Vendors.updateOne(
        { _id: req.params.vendorID },
        {
            $push: {
                locationDetails: req.body,
            }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                res.status(200).json({
                    "message": "Vendor's location submitted successfully.",
                    "vendor_ID": data._id
                });
            } else {
                res.status(401).json({
                    "message": "Vendor Not Found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.update_vendor_location = (req, res, next) => {
    console.log('req', req.params, req.body);
    Vendors.updateOne(
        { "_id": req.params.vendorID, "locationDetails._id": req.params.locationID },
        {
            $set: {
                "locationDetails.$.locationType": req.body.locationType,
                "locationDetails.$.addressLineone": req.body.addressLineone,
                "locationDetails.$.addressLinetwo": req.body.addressLinetwo,
                "locationDetails.$.city": req.body.city,
                "locationDetails.$.states": req.body.states,
                "locationDetails.$.district": req.body.district,
                "locationDetails.$.area": req.body.area,
                "locationDetails.$.pincode": req.body.pincode,
                "locationDetails.$.country": req.body.country

            }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                res.status(200).json({
                    "message": "Vendor's location updated successfully.",
                    "vendor_ID": data._id
                });
            } else {
                res.status(200).json({
                    "message": "Vendor's already location updated"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.delete_vendor_location = (req, res, next) => {
    console.log('req', req.params, req.body);
    Vendors.updateOne(
        { "_id": req.params.vendorID, "locationDetails._id": req.params.locationID },
        {
            $pull: { "locationDetails": { "_id": req.params.locationID } }
        }
    )
        .exec()
        .then(data => {
            if (data.nModified == 1) {
                res.status(200).json({
                    "message": "Vendor's location deleted successfully.",
                });
            } else {
                res.status(200).json({
                    "message": "Vendor's location deleted successfully.",
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.insert_vendor_contact = (req, res, next) => {
    Vendors.findOne({'_id':req.params.vendorID,"contactDetails.Location":req.body.Location})
    .exec()
    .then(contact => {
        if (contact) {
            var lengthData = contact.contactDetails.length;
            
            var lengthDataLevel = contact.contactDetails[lengthData - 1].LocationLevel.length;
            var levelIndex = lengthDataLevel - 1;
            
            if (levelIndex != req.body.levelIndex) {
                Vendors.update({ '_id': req.params.vendorID, "contactDetails.Location": req.body.Location },
                    {
                        $push: {
                            "contactDetails.$.LocationLevel": {
                                'Location': req.body.Location,
                                'Designation': req.body.Designation,
                                'ContactLevel': req.body.ContactLevel,
                                'Phone': req.body.Phone,
                                'Email': req.body.Email,
                                'Name': req.body.Name,
                                'Reportinmanager': req.body.Reportinmanager,
                                'AltPhone': req.body.AltPhone,
                                'Landing': req.body.Landing,
                            },
                        }
                    }
                )
                .exec()
                .then(data => {
                    if (data.nModified == 1) {
                        res.status(200).json({
                            "message": "Vendor's contact submitted successfully.",
                            "vendor_ID": data._id
                        });
                    } else {
                        res.status(401).json({
                            "message": "Vendor Not Found"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            } else {
                Vendors.update({ '_id': req.params.vendorID },
                    {
                        $set: {
                            ["contactDetails." + req.body.contactIndex + ".LocationLevel." + req.body.levelIndex + ".Designation"]: req.body.Designation,
                            ["contactDetails." + req.body.contactIndex + ".LocationLevel." + req.body.levelIndex + ".ContactLevel"]: req.body.ContactLevel,
                            ["contactDetails." + req.body.contactIndex + ".LocationLevel." + req.body.levelIndex + ".Phone"]: req.body.Phone,
                            ["contactDetails." + req.body.contactIndex + ".LocationLevel." + req.body.levelIndex + ".Email"]: req.body.Email,
                            ["contactDetails." + req.body.contactIndex + ".LocationLevel." + req.body.levelIndex + ".Name"]: req.body.Name,
                            ["contactDetails." + req.body.contactIndex + ".LocationLevel." + req.body.levelIndex + ".Reportinmanager"]: req.body.Reportinmanager,
                            ["contactDetails." + req.body.contactIndex + ".LocationLevel." + req.body.levelIndex + ".AltPhone"]: req.body.AltPhone,
                            ["contactDetails." + req.body.contactIndex + ".LocationLevel." + req.body.levelIndex + ".Landing"]: req.body.Landing,
                        }
                    }
                )
                .exec()
                .then(data => {
                    if (data.nModified == 1) {
                        res.status(200).json({
                            "message": "Vendor's contact submitted successfully.",
                            "vendor_ID": data._id
                        });
                    } else {
                        res.status(401).json({
                            "message": "Vendor Not Found"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }
        }else{
            Vendors.update({ '_id': req.params.vendorID },
                {
                    $push: {
                        "contactDetails": {
                            Location: req.body.Location,
                            LocationLevel: [{
                                'Location': req.body.Location,
                                'Designation': req.body.Designation,
                                'ContactLevel': req.body.ContactLevel,
                                'Phone': req.body.Phone,
                                'Email': req.body.Email,
                                'Name': req.body.Name,
                                'Reportinmanager': req.body.Reportinmanager,
                                'AltPhone': req.body.AltPhone,
                                'Landing': req.body.Landing,
                            }]
                        },
                    }
                }

            )
            .exec()
            .then(data => {
                if (data.nModified == 1) {
                    res.status(200).json({
                        "message": "Vendor's contact submitted successfully.",
                        "vendor_ID": data._id
                    });
                } else {
                    res.status(401).json({
                        "message": "Vendor Not Found"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.update_vendor_contact = (req, res, next) => {
    var formValues = req.body;
    var contactDetailsId = formValues._id;
    Vendors.update({'_id':contactDetailsId},
        {$set :{
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Designation"]      : formValues.Designation,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".ContactLevel"]     : formValues.ContactLevel,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Phone"]            : formValues.Phone,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Email"]            : formValues.Email,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Name"]             : formValues.Name,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Reportinmanager"]  : formValues.Reportinmanager,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".AltPhone"]         : formValues.AltPhone,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Landing"]          : formValues.Landing,   
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
exports.list_vendor_with_limits = (req, res, next) => {
    Vendors.find()
        .exec()
        .then(data => {
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
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.count_vendor = (req, res, next) => {
    Vendors.find({})
        .exec()
        .then(data => {
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
            res.status(200).json({ "dataCount": data });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.fetch_vendor = (req, res, next) => {
    Vendors.findOne({ _id: req.params.vendorID })
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
exports.delete_vendor = (req, res, next) => {
    Vendors.deleteOne({ _id: req.params.vendorID })
        .exec()
        .then(data => {
            res.status(200).json({
                "message": "Vendor Deleted Successfully."
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};