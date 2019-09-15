const mongoose	= require("mongoose");

const Category = require('../models/categories');

exports.insert_category = (req,res,next)=>{
	Category.find()
		.exec()
		.then(data =>{
			const category = new Category({
                _id                       : new mongoose.Types.ObjectId(),                    
                category                  : req.body.category,
                categoryUrl               : req.body.categoryUrl,
                subCategory               : req.body.subCategory,
                categoryDescription       : req.body.categoryDescription,
                categoryImage             : req.body.categoryImage,
                categoryIcon              : req.body.categoryIcon,
                section                   : req.body.section,
                createdAt                 : new Date()
            });
            category.save()
            .then(data=>{
                res.status(200).json({
                    "message": "Category Submitted Successfully."
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
exports.update_category = (req,res,next)=>{
    Category.updateOne(
            { _id:req.body.category_ID},  
            {
                $set:{
                category                  : req.body.category,
                categoryUrl               : req.body.categoryUrl,
                subCategory               : req.body.subCategory,
                categoryDescription       : req.body.categoryDescription,
                categoryImage             : req.body.categoryImage,
                categoryIcon              : req.body.categoryIcon,
                section                   : req.body.section,
                createdAt                 : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Category Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Category Not Found"
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
exports.list_section = (req,res,next)=>{
    Category.find()       
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
exports.list_category = (req,res,next)=>{
    Category.find({"section":req.params.section})
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
exports.list_category_with_limits = (req,res,next)=>{
    Category.find()
    .exec()
    .then(data=>{
        console.log('data', data); 45
        var allData = data.map((x, i)=>{
            return {
                "_id"                   : x._id,
                "section"               : x.section,
                "category"              : x.category,
                "subCategory"           : ((x.subCategory.map((a, i)=>{return '<p>'+a.subCategoryTitle+'</p>'})).toString()).replace(/,/g, " "),
                "categoryDescription"   : x.categoryDescription,
                "categoryImage"         : x.categoryImage,
                "categoryIcon"          : x.categoryIcon,
            }
        })
        res.status(200).json(allData.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.count_category = (req,res,next)=>{
    Category.find({})
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
exports.fetch_category = (req,res,next)=>{
    Category.findOne({_id : req.params.categoryID})
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
exports.delete_category = (req,res,next)=>{
    Category.deleteOne({_id:req.params.categoryID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message": "Category Deleted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
