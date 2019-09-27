const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    _id			              : mongoose.Schema.Types.ObjectId,
    section                   : String,
    category                  : String,
    category_ID               : { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    subCategory               : String,
    subCategory_ID            : { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
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
    size                      : String,
    color                     : String,
    originalPrice             : Number,
    discountPercent           : Number,
    discountedPrice           : Number,
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
    type                      : String,
    unit                      : String,
    fileName                  : String,
    createdBy                 : String,
    createdAt                 : Date
});

module.exports = mongoose.model('products',productsSchema);