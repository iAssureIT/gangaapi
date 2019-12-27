const express 	= require("express");
const router 	= express.Router();

const orderController = require('../controllers/orders');

router.post('/post', orderController.insert_orders);

router.patch('/', orderController.update_order);

router.patch('/patch/updateDeliveryStatus', orderController.updateDeliveryStatus);

router.patch('/patch/changeToPreviousStatus', orderController.changeToPreviousStatus);

router.get('/get/list',orderController.list_order);

router.post('/get/vendorwiselist/:vendorID',orderController.vendor_order_list);

router.get('/get/orderlist/:status',orderController.list_orderby_status);

router.post('/get/vendororderstatuslist/:vendorID',orderController.vendor_orderlistby_status);

router.get('/get/count',orderController.count_order);

router.get('/get/vendorwisecount/:vendorID',orderController.vendor_order_count);

router.get('/get/list/:userID',orderController.list_order_by_user);

router.post('/get/list',orderController.list_order_with_limits);

router.get('/get/one/:orderID', orderController.fetch_order);

router.delete('/delete/:orderID',orderController.delete_order);

router.patch('/patch/dispatchOrder',orderController.dispatchOrder);

router.get('/get/listbyba/:ba_ID',orderController.list_order_by_ba);

router.patch('/get/cancelOrder',orderController.cancelOrder);
 
router.patch('/get/returnOrder',orderController.returnOrder);

router.post('/get/report-count',orderController.get_reports_count);

router.post('/get/report/:startRange/:limitRange',orderController.get_reports);

router.post('/get/category-wise-report-count',orderController.get_category_reports_count);

router.post('/get/category-wise-report/:startRange/:limitRange',orderController.get_category_reports);

router.get('/get/ytdorders',orderController.ytdorders);

router.get('/get/mtdorders',orderController.mtdorders);

router.get('/get/mtdorders',orderController.mtdorders);

router.get('/get/neworderscount',orderController.neworderscount);

router.get('/get/totalOrdersByPeriod/:startTime',orderController.totalOrdersByPeriod);

router.get('/get/totalOrdersByState',orderController.totalOrdersByState);

router.get('/get/sectionRevenue',orderController.sectionRevenue);

router.get('/get/categoryRevenue',orderController.categoryRevenue);

router.get('/get/subCategoryRevenue',orderController.subCategoryRevenue);

router.get('/get/vendorWiseOrder',orderController.subCategoryRevenue);

module.exports = router; 