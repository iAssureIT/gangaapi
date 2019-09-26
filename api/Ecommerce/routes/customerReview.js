
const express 	= require("express");
const router 	= express.Router();

const customerReviewController = require('../controllers/customerReview');

router.post('/post', customerReviewController.insertCustomerReview);

module.exports = router;