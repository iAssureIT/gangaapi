const express 	= require("express");
const router 	= express.Router();

const returnedProductsController = require('../controllers/returnedProducts');

router.get('/get/list',returnedProductsController.get_returned_products);

router.patch('/returnStatusUpdate',returnedProductsController.returnStatusUpdate);

router.patch('/returnPickeupInitiated',returnedProductsController.returnPickeupInitiated);

router.get('/get/count',returnedProductsController.returnedCount);

router.get('/get/PendingCount',returnedProductsController.PendingCount);

module.exports = router;