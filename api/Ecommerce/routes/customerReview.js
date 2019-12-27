
const express 	= require("express");
const router 	= express.Router();

const customerReviewController = require('../controllers/customerReview');

router.post('/post', customerReviewController.insertCustomerReview);

router.post('/search/post', customerReviewController.searchCustomerReview);

router.patch('/patch', customerReviewController.updateCustomerReview);

router.patch('/admin/review', customerReviewController.add_admin_comment);

router.get('/get/list/:productID',customerReviewController.listCustomerReview);

router.put('/status', customerReviewController.update_review_status);

// router.get('/get/published/list',customerReviewController.list_customer_reviews);

router.get('/get/count',customerReviewController.count_review);

router.get('/get/vendorwisecount/:vendorID',customerReviewController.vendor_review_count);

router.post('/get/list',customerReviewController.list_review);

router.post('/get/vendorwiselist',customerReviewController.vendor_review_list);

router.get('/get/user/list/:customerID',customerReviewController.listCustomerReviewbucustomerid);

router.get('/get/order/list/:customerID/:orderID/:productID', customerReviewController.listCustomerProductReview);

router.get('/get/avg/:productID',customerReviewController.customerReviewAvg);

router.delete('/delete/:reviewID',customerReviewController.delete_review);

router.get('/get/ytdreviews',customerReviewController.ytdreviews);

router.get('/get/mtdreviews',customerReviewController.mtdreviews);

router.get('/get/todayscount',customerReviewController.count_todaysreview);

router.get('/get/UnpublishedCount',customerReviewController.UnpublishedCount);

router.get('/get/count',customerReviewController.count_review);


module.exports = router;