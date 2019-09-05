const express 	= require("express");
const router 	= express.Router();

const vendorCategoryController = require('../controllers/vendorCategory');

router.post('/post', vendorCategoryController.insert_vendor_category);

router.patch('/patch', vendorCategoryController.update_vendor_category);

router.get('/get/list',vendorCategoryController.list_vendor_category);

router.get('/get/count',vendorCategoryController.count_vendor_category);

router.post('/get/list',vendorCategoryController.list_vendor_category_with_limits);

router.get('/get/one/:vendorCategoryID', vendorCategoryController.fetch_vendor_category);

router.delete('/delete/:vendorCategoryID',vendorCategoryController.delete_vendor_category);






module.exports = router;