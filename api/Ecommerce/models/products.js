const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    _id			              : mongoose.Schema.Types.ObjectId,
    webCategory               : String,
    category                  : String,
    category_ID               : String,
    subCategory               : String,
    subCategory_ID            : String,
    brand                     : String,
    productCode               : String,
    productName               : String,
    productUrl                : String,
    productDetails            : String,
    shortDescription          : String,
    featureList               : [ 
        {
            feature : String,
            index   : Number
        }
    ],
    currency                  : String,
    actualPrice               : Number,
    offeredPrice              : Number,
    availableQuantity         : Number,
    productImage              : Array,
    productVideo              : Array,
    productYTubeVideo         : String,
    productVideoType          : String,
    productPDF                : String,
    productBrochurePDF        : String,
    productInfoPDF            : String,
    status                    : String,
    featured                  : Boolean,
    exclusive                 : Boolean,
    newProduct                : Boolean,
    bestSeller                : Boolean,
    offered                   : Boolean,
    type                      : String,
    unit                      : String,
    fileName                  : String,
    createdBy                 : String,
    createdAt                 : Date
});

module.exports = mongoose.model('products',productsSchema);