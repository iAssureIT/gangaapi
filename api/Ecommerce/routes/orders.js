const express 	= require("express");
const router 	= express.Router();

const orderController = require('../controllers/orders');

router.post('/post', orderController.insert_order);

router.patch('/', orderController.update_order);

router.patch('/patch/updateDeliveryStatus', orderController.updateDeliveryStatus);

router.get('/get/list',orderController.list_order);

router.get('/get/orderlist/:status',orderController.list_orderby_status);

router.get('/get/list/:user_ID',orderController.list_order_by_user);

router.get('/get/count',orderController.count_order);

router.post('/get/list',orderController.list_order_with_limits);

router.get('/get/one/:orderID', orderController.fetch_order);

router.delete('/delete/:orderID',orderController.delete_order);

router.patch('/patch/dispatchOrder',orderController.dispatchOrder);

router.get('/get/listbyba/:ba_ID',orderController.list_order_by_ba);

router.patch('/get/cancelOrder',orderController.cancelOrder);
 
router.patch('/get/returnOrder',orderController.returnOrder);

router.get('/get/report/:startTime/:endTime',orderController.get_reports);

module.exports = router;