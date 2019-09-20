const express 	= require("express");
const router 	= express.Router();

const productController = require('../controllers/products');

router.post('/post', productController.insert_product);

router.post('/post/bulkUploadProduct', productController.bulkUploadProduct);

router.post('/get/wishlist/product', productController.wishlist_product);

router.patch('/patch', productController.update_product);

router.get('/get/list',productController.list_product);

//router.get('/get/brandlist',productController.list_brand);

router.get('/get/listbytype/:section/:productType',productController.list_productby_type);

router.get('/get/listbytypeNcategory/:categoryID/:productType',productController.list_productby_type_category);

router.get('/get/list/:categoryID',productController.list_productby_category);

router.get('/get/list/:categoryID/:subcategoryID',productController.list_productby_subcategory);

router.put('/attribute', productController.update_product_attribute);

router.put('/status', productController.update_product_status);

router.put('/multiple', productController.update_product_multiple);

router.get('/get/count',productController.count_product);

router.post('/get/files',productController.fetch_file);

router.get('/get/files/count',productController.fetch_file_count);

router.post('/get/list',productController.list_product_with_limits);

router.patch('/patch/gallery', productController.upload_photo);

router.get('/get/one/:productID', productController.fetch_product);

router.get('/get/hotproduct', productController.fetch_hot_product);

router.delete('/delete/:productID',productController.delete_product);

router.delete('/file/delete/:fileName',productController.delete_file);

router.get('/get/search/:searchstr', productController.search_product);

router.post('/post/searchINCategory', productController.searchINCategory);

router.get('/get/listBrand/:categoryID', productController.list_brand);

router.get('/get/minmaxprice', productController.get_minmaxprice);

router.get('/get/listGroceryBrand', productController.list_grocerybrand);

router.get('/get/getmegamenulist', productController.get_menu_list);

router.post('/post/list/filterMainProducts', productController.filterMainProducts);


module.exports = router;