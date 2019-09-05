const express 	= require("express");
const router 	= express.Router();

const categoryController = require('../controllers/categories');

router.post('/post', categoryController.insert_category);

router.patch('/patch', categoryController.update_category);

router.get('/get/list',categoryController.list_webCategory);

router.get('/get/list/:webCategory',categoryController.list_category);

router.get('/get/count',categoryController.count_category);

router.post('/get/list',categoryController.list_category_with_limits);

router.get('/get/one/:categoryID', categoryController.fetch_category);

router.delete('/delete/:categoryID',categoryController.delete_category);

// router.delete('/',categoryController.deleteall_category);





module.exports = router;