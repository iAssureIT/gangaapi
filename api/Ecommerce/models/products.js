const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    _id			              : mongoose.Schema.Types.ObjectId,
    vendor_ID                 : { type: mongoose.Schema.Types.ObjectId, ref: 'vendors' },
    user_ID                   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    vendorName                : String,
    section                   : String,
    section_ID                : { type: mongoose.Schema.Types.ObjectId, ref: 'sections' },
    category                  : String,
    category_ID               : { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    subCategory               : String,
    subCategory_ID            : { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    brand                     : String,
    productCode               : String,
    itemCode                  : String,
    productName               : String,
    productUrl                : String,
    productDetails            : String,
    shortDescription          : String,
    featureList               : String,
    currency                  : String,
    size                      : String,
    color                     : String,
    tags                      : [],
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
    attributes                : [ 
        {
            index            : String,
            attributeName    : String,
            attributeValue   : String
        }
    ],
    taxInclude               : Boolean,
    taxRate                  : Number,
    fileName                 : String,
    createdBy                : String,
    createdAt                : Date
});

module.exports = mongoose.model('products',productsSchema);