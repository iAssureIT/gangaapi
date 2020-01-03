const express 	= require("express");
const router 	= express.Router();

const productController = require('../controllers/products');

router.post('/post', productController.insert_product);

router.post('/post/bulkUploadProduct', productController.bulkUploadProduct);

router.get('/get/filedetails/:fileName',productController.filedetails);

router.post('/get/wishlist/product', productController.wishlist_product);

router.patch('/patch', productController.update_product);

router.patch('/patch/availablequantity', productController.update_availablequantity);

router.get('/get/list',productController.list_product);

router.get('/get/productcode/:productCode',productController.list_product_code);

//router.get('/get/brandlist',productController.list_brand);

router.get('/get/listbytype/:productType',productController.list_productby_type);

router.get('/get/listbytypeNcategory/:categoryID/:productType',productController.list_productby_type_category);

router.get('/get/list/:sectionID',productController.list_productby_section);

router.get('/get/listbycategory/:categoryID',productController.list_productby_category);

router.get('/get/list/:categoryID/:subcategoryID',productController.list_productby_subcategory);

router.put('/attribute', productController.update_product_attribute);

router.put('/status', productController.update_product_status);

router.put('/multiple', productController.update_product_multiple);

router.get('/get/count',productController.count_product);

router.get('/get/vendorwisecount/:vendorID',productController.count_vendor_product);

router.post('/get/files',productController.fetch_file);

router.post('/get/vendorfiles',productController.fetch_vendor_file);

router.get('/get/files/count',productController.fetch_file_count);

router.get('/get/vendorfiles/count/:vendorID',productController.fetch_vendorfile_count);
 
router.post('/get/list',productController.list_product_with_limits);

router.post('/get/vendorwiselist',productController.list_product_with_vendor);

router.post('/get/vendorwiseimagelist/:vendorID',productController.list_productimage_with_vendor);

router.patch('/patch/gallery', productController.upload_photo);

router.patch('/patch/bulkimages/', productController.upload_photo_product_code);

router.patch('/remove/image', productController.remove_photo);

router.get('/get/one/:productID', productController.fetch_product);

router.get('/get/hotproduct', productController.fetch_hot_product);

router.delete('/delete/:productID',productController.delete_product);

router.delete('/file/delete/:fileName',productController.delete_file);

router.get('/get/adminsearch/:searchstr', productController.admin_search_product);

router.get('/get/search/:searchstr/:vendorID', productController.vendor_search_product);

router.get('/get/searchcount/:searchstr/:vendorID', productController.vendor_search_count_product);

router.get('/get/search/:searchstr', productController.search_product);

router.post('/post/searchINCategory', productController.searchINCategory);

router.get('/get/listBrand/:sectionID', productController.list_brand);

router.post('/get/listBrandByCategories', productController.listBrandByCategories);

router.post('/get/listBrandBySubcategories', productController.listBrandBySubcategories);

router.get('/get/listSize/:sectionID', productController.list_size);

router.get('/get/listSizeByCategory/:categoryID', productController.listSizeByCategory);

router.get('/get/listSizeBySubcategory/:subcategoryID', productController.listSizeBySubcategory);

router.get('/get/listColor/:sectionID', productController.list_color);

router.get('/get/listColorByCategory/:categoryID', productController.listColorByCategory);

router.get('/get/listColorBySubcategory/:subcategoryID', productController.listColorBySubcategory);

router.get('/get/minmaxprice/:sectionID', productController.get_minmaxprice);

router.get('/get/listGroceryBrand', productController.list_grocerybrand);

router.get('/get/getmegamenulist', productController.get_menu_list);

router.post('/post/list/adminFilterProducts', productController.admin_filter_products);

router.post('/post/adminFilterProductsCount', productController.admin_filter_productsCount); 

router.post('/post/list/filterProducts', productController.filter_products);

router.get('/get/productCountByStatus', productController.productCountByStatus);

router.get('/get/vendorProductCount/:vendorID', productController.vendorProductCount);

router.patch('/patch/productBulkAction', productController.productBulkAction);

router.get('/get/outofstockproducts', productController.outofstockproducts);

router.get('/get/attributes/:sectionID', productController.getattributes);

router.get('/get/attributesbycategory/:categoryID', productController.getattributesbycategory);

router.get('/get/attributesbysubcategory/:subCategoryID', productController.getattributesbysubcategory);

module.exports = router;