const express 	= require("express");
const router 	= express.Router();

const vendorLocationTypeController = require('../controllers/vendorLocationType');

router.post('/post', vendorLocationTypeController.insert_vendor_location);

router.patch('/patch', vendorLocationTypeController.update_vendor_location);

router.get('/get/list',vendorLocationTypeController.list_vendor_location);

router.get('/get/count',vendorLocationTypeController.count_vendor_location);

router.post('/get/list',vendorLocationTypeController.list_vendor_location_with_limits);

router.get('/get/one/:vendorCategoryID', vendorLocationTypeController.fetch_vendor_location);

router.delete('/delete/:vendorCategoryID',vendorLocationTypeController.delete_vendor_location);



module.exports = router;