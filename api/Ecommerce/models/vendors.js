const mongoose = require('mongoose');

const vendorsSchema = mongoose.Schema({
	_id			              : mongoose.Schema.Types.ObjectId,
    typeOptions               : String,
    companyName               : String,
    pan                       : String,
    tin                       : String,
    website                   : String,
    gstno                     : String,
    category                  : String,
    coino                     : String,
    mfg                       : String,
    score                     : String,
    Evaluation                : String,
    logo                      : String,
    attachedDocuments         : Array,
    locationDetails           : Array,
    contactDetails            : Array,
    productsServices          : Array,
    vendorID                 : String,
    Owner_ID                  : String,
    createdBy                 : String,
    createdAt                 : Date
});

module.exports = mongoose.model('vendors',vendorsSchema);