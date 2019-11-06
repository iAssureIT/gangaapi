const express 	= require("express");
const router 	= express.Router();

const orderController = require('../controllers/orders');

router.post('/post', orderController.insert_order);

router.patch('/', orderController.update_order);

router.patch('/patch/updateDeliveryStatus', orderController.updateDeliveryStatus);

router.patch('/patch/changeToPreviousStatus', orderController.changeToPreviousStatus);

router.get('/get/list',orderController.list_order);

router.get('/get/orderlist/:status',orderController.list_orderby_status);

router.get('/get/count',orderController.count_order);

router.get('/get/list/:userID',orderController.list_order_by_user);

router.post('/get/list',orderController.list_order_with_limits);

router.get('/get/one/:orderID', orderController.fetch_order);

router.delete('/delete/:orderID',orderController.delete_order);

router.patch('/patch/dispatchOrder',orderController.dispatchOrder);

router.get('/get/listbyba/:ba_ID',orderController.list_order_by_ba);

router.patch('/get/cancelOrder',orderController.cancelOrder);
 
router.patch('/get/returnOrder',orderController.returnOrder);

router.get('/get/report/:startTime/:endTime/:startRange/:limitRange',orderController.get_reports);

router.post('/get/category-wise-report/',orderController.get_category_reports);

router.get('/get/ytdorders',orderController.ytdorders);

router.get('/get/mtdorders',orderController.mtdorders);

router.get('/get/mtdorders',orderController.mtdorders);

router.get('/get/todaysorders',orderController.todaysneworders);

router.get('/get/todaysneworders',orderController.todaysneworders);

router.get('/get/totalOrdersByPeriod/:startTime',orderController.totalOrdersByPeriod);

router.get('/get/totalOrdersByState',orderController.totalOrdersByState);

router.get('/get/sectionRevenue',orderController.sectionRevenue);

router.get('/get/categoryRevenue',orderController.categoryRevenue);

router.get('/get/subCategoryRevenue',orderController.subCategoryRevenue);

module.exports = router; 