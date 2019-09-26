
const express 	= require("express");
const router 	= express.Router();

const customerReviewController = require('../controllers/customerReview');

router.post('/post', customerReviewController.insertCustomerReview);
router.get('/get/list/:productID',customerReviewController.listCustomerReview);


module.exports = router;