const express 	= require("express");
const router 	= express.Router();

const vendorController = require('../controllers/vendors');

router.post('/post', vendorController.insert_vendor);

router.patch('/patch', vendorController.update_vendor);

router.get('/get/list',vendorController.list_vendor);

router.get('/get/greatestid',vendorController.get_greatest_vendorid);

router.patch('/insert/location/:vendorID',vendorController.insert_vendor_location);

router.patch('/update/location/:vendorID/:locationID',vendorController.update_vendor_location);

router.patch('/delete/location/:vendorID/:locationID',vendorController.delete_vendor_location);

router.patch('/insert/contact/:vendorID',vendorController.insert_vendor_contact);

router.patch('/update/contact/:vendorID/:contactID',vendorController.update_vendor_contact);

router.patch('/delete/contact/:vendorID/:contactID',vendorController.delete_vendor_contact);

router.get('/get/count',vendorController.count_vendor);

router.post('/get/list',vendorController.list_vendor_with_limits);

router.get('/get/one/:vendorID', vendorController.fetch_vendor);

router.get('/get/listbyuserid/:userID', vendorController.fetch_vendorid);

router.delete('/delete/:vendorID',vendorController.delete_vendor);

// router.delete('/',vendorController.deleteall_vendor);





module.exports = router;