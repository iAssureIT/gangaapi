const express 	= require("express");
const router 	= express.Router();

const vendorController = require('../controllers/vendors');

router.post('/post', vendorController.insert_vendor);

router.patch('/patch', vendorController.update_vendor);

router.get('/get/list',vendorController.list_vendor);

router.patch('/insert/location/:vendorID',vendorController.insert_vendor_location);

router.patch('/update/location/:vendorID/:locationID',vendorController.update_vendor_location);

router.patch('/delete/location/:vendorID/:locationID',vendorController.delete_vendor_location);

router.patch('/insert/contact/:vendorID',vendorController.insert_vendor_contact);

router.patch('/update/contact/:vendorID/:contactID/:levelID',vendorController.insert_vendor_contact);

router.get('/get/count',vendorController.count_vendor);

router.post('/get/list',vendorController.list_vendor_with_limits);

router.get('/get/one/:vendorID', vendorController.fetch_vendor);

router.delete('/delete/:vendorID',vendorController.delete_vendor);

// router.delete('/',vendorController.deleteall_vendor);





module.exports = router;