const mongoose  = require("mongoose");
const Sections = require('../models/sections');

exports.insert_section = (req,res,next)=>{
	var sectionUrl = req.body.section.replace(/\s+/g, '-').toLowerCase();
    Sections.find()
        .exec()
        .then(data =>{
        	const SectionObj = new Sections({
                        _id                       : new mongoose.Types.ObjectId(),                    
                        section                   : req.body.section,
                        sectionUrl                : sectionUrl,
                        createdBy 				  : req.body.createdBy, 	
                        createdAt                 : new Date()
                    });

                    SectionObj
                    .save()
                    .then(data=>{
                        res.status(200).json({
                    		"message": "Section is submitted successfully."
                		});
                    })
                    .catch(err =>{
                    	res.status(500).json({
		                    error: err
		                });
                    });
        })
};        

exports.get_sections = (req,res,next)=>{
    Sections.find()       
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.get_single_section = (req,res,next)=>{
    Sections.findOne({_id : req.params.sectionID})       
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.update_section = (req,res,next)=>{
    var sectionUrl = req.body.section.replace(/\s+/g, '-').toLowerCase();
    Sections.updateOne(
            { _id:req.body.sectionID},  
            {
                $set:{
                section                   : req.body.section,
                sectionUrl                : sectionUrl 
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Section Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Section Not Found"
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

exports.delete_section = (req,res,next)=>{
    Sections.deleteOne({_id:req.params.sectionID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message": "Section Deleted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
