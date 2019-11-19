const express 	= require("express");
const router 	= express.Router();

const wishlistsController = require('../controllers/wishlist');

router.post('/post', wishlistsController.insert_wishlist);

// router.patch('/', wishlistsController.update_wishlists);

router.get('/get/list',wishlistsController.list_wishlist);

router.get('/get/userwishlist/:user_ID',wishlistsController.get_user_wishlist);

router.get('/get/count',wishlistsController.count_wishlist);

router.get('/get/wishlistcount/:user_ID',wishlistsController.usercount_wishlist);

router.post('/get/list',wishlistsController.list_wishlist_with_limits);

router.get('/get/one/:wishID', wishlistsController.fetch_wishlist);

router.get('/get/one/productwish/:userID/:productID', wishlistsController.fetch_wishlist_product);

router.delete('/delete/:wishlist_ID',wishlistsController.delete_wishlist);

// router.delete('/',wishlistsController.deleteall_wishlist);





module.exports = router;