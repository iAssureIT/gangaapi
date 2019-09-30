const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	_id			              : mongoose.Schema.Types.ObjectId,
    category                  : String,
    categoryUrl               : String,
    subCategory               : [
	    {
	    	index 			  : Number,
            subCategoryCode   : String,
            subCategoryTitle  : String,
	    }
    ],
    categoryDescription       : String,
    categoryImage             : String,
    categoryIcon              : String,
    section                   : String,
    section_ID                : { type: mongoose.Schema.Types.ObjectId, ref: 'sections' },
    createdBy                 : String,
    createdAt                 : Date
});

module.exports = mongoose.model('categories' ,categorySchema);