const mongoose = require('mongoose');

const preferenceSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
    taxName     : String,
    taxDetails  : [{
        taxRate         : Number,
        effectiveFrom   : Date,
        effectiveTo     : Date,
        createdAt       : Date,
        createdBy       : Date
    }],
});

module.exports = mongoose.model('preference',preferenceSchema);
