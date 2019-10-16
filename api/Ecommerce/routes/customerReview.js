
const express 	= require("express");
const router 	= express.Router();

const customerReviewController = require('../controllers/customerReview');

router.post('/post', customerReviewController.insertCustomerReview);

router.post('/search/post', customerReviewController.searchCustomerReview);

router.patch('/patch', customerReviewController.updateCustomerReview);

router.get('/get/list/:productID',customerReviewController.listCustomerReview);

router.put('/status', productController.update_review_status);

router.get('/get/list',customerReviewController.list_customer_reviews);

router.get('/get/count',customerReviewController.count_review);

router.post('/get/list',customerReviewController.list_review);

router.get('/get/user/list/:customerID',customerReviewController.listCustomerReviewbucustomerid);


module.exports = router;