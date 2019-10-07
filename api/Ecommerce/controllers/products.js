const mongoose  = require("mongoose");
const _         = require("underscore");
const Products = require('../models/products');
const Category = require('../models/categories');
const Sections = require('../models/sections');

exports.insert_product = (req,res,next)=>{
    Products.find({"itemCode" : req.body.itemCode})
        .exec()
        .then(data =>{
        if(data && data.length > 0){
            res.status(200).json({
                "message": "Item code already exists.",
            });
        }else{
            const products = new Products({
                _id                       : new mongoose.Types.ObjectId(),   
                section                   : req.body.section, 
                section_ID                : req.body.section_ID,                
                category                  : req.body.category,
                category_ID               : req.body.category_ID,
                subCategory               : req.body.subCategory,
                subCategory_ID            : req.body.subCategory_ID,
                brand                     : req.body.brand,
                productCode               : req.body.productCode,
                itemCode                  : req.body.itemCode,
                productName               : req.body.productName,
                productUrl                : req.body.productUrl,
                productDetails            : req.body.productDetails,
                shortDescription          : req.body.shortDescription,
                featureList               : req.body.featureList,
                currency                  : req.body.currency,
                discountPercent           : req.body.discountPercent,
                actualPrice               : req.body.actualPrice,
                offeredPrice              : req.body.offeredPrice,
                originalPrice             : req.body.originalPrice,
                discountedPrice           : req.body.discountedPrice,
                availableQuantity         : req.body.availableQuantity,
                status                    : req.body.status,
                tags                      : req.body.tags,
                offered                   : req.body.offered,
                unit                      : req.body.unit,
                size                      : req.body.size,
                color                     : req.body.color,
                type                      : req.body.type,
                fileName                  : req.body.fileName,
                createdAt                 : new Date()
            });
            products.save()
            .then(data=>{
                res.status(200).json({
                    "message": "Product Submitted Successfully.",
                    "product_ID" : data._id
                });
            })
            .catch(err =>{
                console.log("err0",err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch(err =>{
        console.log("err1",err);
        res.status(500).json({
            error: err
        });
    });
};

exports.bulkUploadProduct = (req,res,next)=>{
    var record = []; 
    var i = 0;
    var found = 0;
    var catid;
    var subcatid;
    getData();

    async function getData(){
        var productData = req.body;
        var Count  = 0;
        for(k = 0 ; k < productData.length ; k++){
            if(productData[k].section!= undefined){

                var sectionObject = await sectionInsert(productData[k].section)

                var categoryObject = await categoryInsert(productData[k].category,productData[k].subCategory,sectionObject.section_ID);
                
                var insertProductObject = await insertProduct(sectionObject.section_ID,categoryObject,productData[k]);
                
                if (insertProductObject != 0) {
                    Count++;
                }else{

                }
            }        
        }
        res.status(200).json({
            "message": "Product Submitted Successfully.",
            "productsAdded" : Count
        });    
    }
};

function sectionInsert(sectionName) {
    return new Promise(function(resolve,reject){    
        sectionDuplicateControl();
        async function sectionDuplicateControl(){
            var sectionPresent = await findSection(sectionName);
            var sectionUrl = sectionName.replace(/\s+/g, '-').toLowerCase();
            if(sectionPresent === 0){
                const sectionObj = new Sections({
                        _id                       : new mongoose.Types.ObjectId(),
                        section                   : sectionName,
                        sectionUrl                : sectionUrl, 
                        createdAt                 : new Date()
                    });

                    sectionObj
                    .save()
                    .then(data=>{
                        //console.log('insertCategory',data.subCategory[0]._id);
                        resolve({section_ID : data._id});
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                Sections.findOne({ section : sectionName})
                        .exec()
                        .then(sectionObject=>{
                            if(sectionObject){
                                //console.log('section',sectionObject);
                                //resolve(categoryObject);
                                resolve({section_ID : sectionObject._id});
                            }else{
                                resolve(0);
                            }
                        })
            }
        }

        
    })                   
}

function categoryInsert(catgName,subcatgName,section) {
    return new Promise(function(resolve,reject){    
        categoryDuplicateControl();
        async function categoryDuplicateControl(){
            var categoryPresent = await findCat(catgName);
            
            if(categoryPresent === 0){
                const categoryObj = new Category({
                        _id                       : new mongoose.Types.ObjectId(),                    
                        category                  : catgName,
                        categoryUrl               : catgName.toLowerCase(),
                        subCategory               : {subCategoryTitle:subcatgName},
                        categoryDescription       : '',
                        categoryImage             : '',
                        categoryIcon              : '',
                        section_ID                : section,
                        createdAt                 : new Date()
                    });

                    categoryObj
                    .save()
                    .then(data=>{
                        //console.log('insertCategory',data.subCategory[0]._id);
                        resolve({category_ID : data._id, subCategory_ID : data.subCategory[0]._id});
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{

                var subcatg = categoryPresent.subCategory.find(subcatgObj => subcatgObj.subCategoryTitle === subcatgName);
                
                if(subcatg){
                    resolve({category_ID : categoryPresent._id, subCategory_ID : subcatg._id});
                }else{
                    //update Category collection for a new subCategory;
                    Category.updateOne(
                        { _id:categoryPresent._id},  
                        {
                            $push:  { 'subCategory' : {subCategoryTitle : subcatgName} }
                        }
                    )
                    .exec()
                    .then(addedsubcat=>{
                        if (addedsubcat.nModified == 1 ) {
                            Category.findOne({ category : catgName})
                                    .exec()
                                    .then(categoryObject=>{
                                        if(categoryObject){
                                           // console.log('subcategoryPresent',categoryObject.subCategory[categoryObject.subCategory.length-1]._id)

                                            //resolve(categoryObject);
                                            resolve({category_ID : categoryPresent._id, subCategory_ID : categoryObject.subCategory[categoryObject.subCategory.length-1]._id});
                                        }else{
                                            resolve(0);
                                        }
                                    })
                        }
                    })
                }
                
            }
        }

        
    })                   
} 

function findSection(sectionName) {
    return new Promise(function(resolve,reject){  
    Category.findOne({ section : sectionName})
                .exec()
                .then(sectionObject=>{
                    if(sectionObject){
                        resolve(sectionObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}

function findCat(catgName) {
    return new Promise(function(resolve,reject){  
    Category.findOne({ category : catgName})
                .exec()
                .then(categoryObject=>{
                    if(categoryObject){
                        resolve(categoryObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}

var insertProduct = async (section_ID, categoryObject, data) => {
    return new Promise(function(resolve,reject){ 
        productDuplicateControl();
        async function productDuplicateControl(){
            var productPresent = await findProduct(data.productCode,data.productName);
            //console.log('productPresent',productPresent)
            if (productPresent==0) {
                    const productObj = new Products({
                        _id                       : new mongoose.Types.ObjectId(),   
                        section_ID                : section_ID,                 
                        category                  : data.category,
                        category_ID               : categoryObject.category_ID,
                        subCategory               : data.subCategory,
                        subCategory_ID            : categoryObject.subCategory_ID,
                        brand                     : data.brand,
                        productCode               : data.productCode,
                        itemCode                  : data.itemCode,
                        productName               : data.productName,
                        productUrl                : data.productName.replace(/\s+/g, '-').toLowerCase(),
                        productDetails            : data.productDetails,
                        shortDescription          : data.shortDescription,
                        featureList               : data.featureList,
                        currency                  : data.currency,
                        originalPrice             : data.originalPrice,
                        discountPercent           : data.discountPercent,  
                        discountedPrice           : data.discountedPrice,
                        offeredPrice              : data.offeredPrice,
                        actualPrice               : data.actualPrice,
                        availableQuantity         : data.availableQuantity,
                        status                    : data.status,
                        offered                   : data.offered,
                        unit                      : data.unit,
                        size                      : data.size,
                        color                     : data.color,
                        exclusive                 : data.exclusive,
                        featured                  : data.featured,
                        newProduct                : data.newProduct,
                        productVideoType          : data.productVideoType,
                        productYTubeVideo         : data.productYTubeVideo,
                        tags                      : data.tags,
                        fileName                  : data.filename,
                        createdBy                 : data.createdBy,
                        createdAt                 : new Date()
                    });
                
                productObj
                .save()
                .then(data=>{
                    resolve(data._id);
                })
                .catch(err =>{
                    console.log(err);
                    reject(err);
                });
            }else{
                resolve(0);
            }
        }
    })
}

function findProduct(productCode, productName) {
    return new Promise(function(resolve,reject){  
    Products.findOne(
                { "$or": 
                    [
                    {"productName"    : {'$regex' : '^' + productName , $options: "i"} },
                    {"productCode"    : productCode },
                    ]
                })

                .exec()
                .then(productObject=>{
                    if(productObject){
                        resolve(productObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
exports.update_product = (req,res,next)=>{
    Products.updateOne(
            { _id:req.body.product_ID},  
            {
                $set:{
                section                   : req.body.section,
                section_ID                : req.body.section_ID,          
                category                  : req.body.category,
                category_ID               : req.body.category_ID,
                subCategory               : req.body.subCategory,
                subCategory_ID            : req.body.subCategory_ID,
                brand                     : req.body.brand,
                productCode               : req.body.productCode,
                itemCode                  : req.body.itemCode,
                productName               : req.body.productName,
                productUrl                : req.body.productUrl,
                productDetails            : req.body.productDetails,
                shortDescription          : req.body.shortDescription,
                featureList               : req.body.featureList,
                currency                  : req.body.currency,
                availableQuantity         : req.body.availableQuantity,
                discountPercent           : req.body.discountPercent,
                discountedPrice           : req.body.discountedPrice,
                originalPrice             : req.body.originalPrice,
                offeredPrice              : req.body.offeredPrice,
                actualPrice               : req.body.actualPrice,
                status                    : req.body.status,
                tags                      : req.body.tags,
                offered                   : req.body.offered,
                unit                      : req.body.unit,
                size                      : req.body.size,
                color                     : req.body.color,
                createdAt                 : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Product Updated Successfully.",
                    "product_ID" : data._id
                });
            }else{
                res.status(401).json({
                    "message": "Product Not Found"
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
exports.update_product_attribute = (req,res,next)=>{
    console.log('params', req.params.attribute);
    Products.updateOne(
            { _id:req.body.product_ID},  
            {
                $set:{
                    [req.body.attribute] : req.body.attributeValue,
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Success",
                });
            }else{
                res.status(401).json({
                    "message": "Product Not Found"
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

exports.update_product_status = (req,res,next)=>{
    Products.updateOne(
            { _id:req.body.product_ID},  
            {
                $set:{
                    "status" : req.body.status,
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Success",
                });
            }else{
                res.status(401).json({
                    "message": "Product Not Found"
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
exports.update_product_multiple = (req,res,next)=>{
    Products.updateMany(
            { _id:{$in : req.body.publishData}},  
            {
                $set:{
                    "status" : "Publish",
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Success",
                });
            }else{
                res.status(401).json({
                    "message": "Product Not Found"
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

exports.list_product = (req,res,next)=>{
    Products.find({"status": "Publish"})       
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

exports.wishlist_product = (req,res,next)=>{
    // console.log('req.body.productIDs', req.body);
    Products.find({ "_id": { $in: req.body } })       
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


exports.list_productby_type = (req,res,next)=>{
    
    var productType = req.params.productType;

    selector={};
    if(productType == 'featured'){
        selector={'featured':true,  "status": "Publish"};
        Products.find(selector)       
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
    else if(productType == 'exclusive'){
        selector={'exclusive':true,  "status": "Publish"};
        Products.find(selector)       
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
    else if(productType == 'newProduct'){
        selector={'newProduct':true,  "status": "Publish"};
        Products.find(selector)       
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
    else if(productType == 'bestSeller'){
        selector={'bestSeller':true,  "status": "Publish"};
        Products.find(selector)       
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
    else{
        res.status(200).json([]);
    }
    
};
exports.list_productby_type_category = (req,res,next)=>{
    var productType = req.params.productType;
    var categoryID = req.params.categoryID;

    var selector={};
    if(productType == 'featured'){
        selector={'featured':true, 'category_ID':categoryID, "status": "Publish"};
    } else if(productType == 'exclusive'){
        selector={'exclusive':true,  'category_ID':categoryID,"status": "Publish"}; 
    } else if(productType == 'newProduct'){
        selector={'newProduct':true,  'category_ID':categoryID,"status": "Publish"};
    } else if(productType == 'bestSeller'){
        selector={'bestSeller':true,  'category_ID':categoryID,"status": "Publish"};
    }
    Products.find(selector)       
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
exports.list_product_with_limits = (req,res,next)=>{
    console.log('req', req.body);
    Products.find()
    .sort({ "createdAt": -1 })
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{
            return {
                "_id"                   : x._id,
                "productCode"           : x.productCode,
                "itemCode"              : x.itemCode,
                "productName"           : x.productName,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
                "newProduct"            : x.newProduct,
                "bestSeller"            : x.bestSeller,
                "status"                : x.status
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
exports.count_product = (req,res,next)=>{
    Products.find({})
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{
            return {
                "_id"                   : x._id,
                "productCode"           : x.productCode,
                "itemCode"              : x.itemCode,
                "productName"           : x.productName,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
                "newProduct"            : x.newProduct,
                "bestSeller"            : x.bestSeller,
                "status"                : x.status
            }
        })
        res.status(200).json({"dataCount":allData.length});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_product = (req,res,next)=>{
    Products.findOne({_id : req.params.productID})
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
exports.fetch_hot_product = (req,res,next)=>{
    Products.find({ "offered": true})
    .sort({ "createdAt": 1 })
    .limit(4)
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
exports.fetch_file = (req,res,next)=>{
    Products.find()
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'productCount': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};
exports.fetch_file_count = (req,res,next)=>{
    Products.find()
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'productCount': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.length);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};
exports.delete_file = (req,res,next)=>{
    Products.deleteMany({"fileName":req.params.fileName})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message" : "Products of file "+req.params.fileName+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};
exports.delete_product = (req,res,next)=>{
    Products.deleteOne({_id:req.params.productID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message": "Product Deleted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.upload_photo = (req,res,next)=>{
    console.log("input = ",req.body);
    
    Products.findOne({"_id":req.body.product_ID})
    .exec()
    .then( targetProperty =>{
        Products.updateOne(
            { "_id" : req.body.product_ID},
            {   
                $set:{                            
                    "productImage" : req.body.productImage,       
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);        
                res.status(200).json({
                    "message": "Images and Video Updated"
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

exports.list_productby_section = (req,res,next)=>{
    Products.find({section_ID : req.params.sectionID, "status": "Publish"})
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
exports.list_productby_category = (req,res,next)=>{
    Products.find({category_ID : req.params.categoryID, "status": "Publish"})
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
exports.list_productby_subcategory = (req,res,next)=>{
    console.log(req.params.categoryID);
    console.log(req.params.subcategoryID);
    Products.find({category_ID : req.params.categoryID, subCategory_ID:req.params.subcategoryID, "status": "Publish"})
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


exports.search_product = (req,res,next)=>{
    Products.find(
            { "$or": 
                    [
                    {"productName"    : {'$regex' : '^' + req.params.searchstr , $options: "i"} },
                    {"brand"          : {'$regex' : '^' + req.params.searchstr , $options: "i"} },
                    {"category"       : {'$regex' : '^' + req.params.searchstr , $options: "i"} },
                    {"subCategory"    : {'$regex' : '^' + req.params.searchstr , $options: "i"} }, 
                    ] 
            }
        )
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


exports.searchINCategory = (req,res,next)=>{


    Products.find({
        //"category_ID" : {$in : [ObjectId("5d75f228fc87471d3d023ae9")]},
        "category" : {$in : req.body.catArray},
        "$or": [ 
                {"productName"    : {'$regex' : '^' + req.body.searchstr , $options: "i"} },
                {"brand"          : {'$regex' : '^' + req.body.searchstr , $options: "i"} },
                {"category"       : {'$regex' : '^' + req.body.searchstr , $options: "i"} },
                {"subCategory"    : {'$regex' : '^' + req.body.searchstr , $options: "i"} }
            ]
        })
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

exports.list_brand = (req,res,next)=>{
    
    Products.distinct("brand", {"section_ID": req.params.sectionID})
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
exports.list_size = (req,res,next)=>{
    
    Products.distinct("size", {"section_ID": req.params.sectionID})
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
exports.list_color = (req,res,next)=>{
    
    Products.distinct("color", {"section_ID": req.params.sectionID})
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
exports.list_grocerybrand = (req,res,next)=>{
    
    Products.distinct("brand", {"section":"Grocery"})
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

exports.filter_products = (req,res,next)=>{
    var selector = {};
    for (var key in req.body) {
        if (key == 'price') {
            selector.discountedPrice  = { $gt : req.body.price.min, $lt : req.body.price.max }
        }
        if (key == 'brands') {
            if (req.body.brands.length>0) {
                selector.brand = { $in: req.body.brands } 
            }
        }
        if (key != 'price' && key != 'brands') {
            selector[key] = req.body[key];
        }
    }
    Products.find(selector)
    .exec()
    .then(data=>{
        //console.log(data);
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.get_menu_list = (req,res,next)=>{
   
    Category.aggregate([
    { $lookup:
       {
         from: 'products',
         localField: '_id',
         foreignField: 'category_ID',
         as: 'orderdetails'
       }
     },
     {
        $match: {
          "orderdetails.featured": true
        }
     },
     {
        $sort: {
          "orderdetails.createdAt": -1
        }
     }
    ])
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

exports.get_minmaxprice = (req,res,next)=>{
    var priceArray = {}
    Products.find({},{actualPrice:1}).sort({actualPrice:1}).limit(1)
    .exec()
    .then(data=>{
        priceArray.min =  data[0].actualPrice ;
        
            Products.find({},{actualPrice:1}).sort({actualPrice:-1}).limit(1)
            .exec()
            .then(data1=>{
                priceArray.max =  data1[0].actualPrice ;
                res.status(200).json(priceArray);
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



