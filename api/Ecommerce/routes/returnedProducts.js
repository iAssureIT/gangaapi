const express 	= require("express");
const router 	= express.Router();

const returnedProductsController = require('../controllers/returnedProducts');

router.get('/get/list',returnedProductsController.get_returned_products);

module.exports = router;