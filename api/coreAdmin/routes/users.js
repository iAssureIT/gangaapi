const express 	= require("express");

const router 	= express.Router();

const checkAuth     = require('../middlerware/check-auth');

const UserController = require('../controllers/users');

// router.post('/', UserController.user_signup); 

router.post('/', UserController.user_signupadmin); 

router.post('/ba', UserController.ba_signupadmin); 

router.post('/vendor', UserController.vendor_signup); 

router.post('/login',UserController.user_login); 

router.post('/userslist',UserController.users_fetch); 

router.get('/list', UserController.users_list); 

router.get('/vendorlist', UserController.vendor_list); 

router.patch('/useraddress',UserController.add_user_address); 

router.patch('/:userID',UserController.update_user); 

router.patch('/userdetails/:userID',UserController.update_user_details); 

router.patch('/patch/address',UserController.add_delivery_address);  

router.patch('/delete/address',UserController.delete_delivery_address);  

router.get('/userslist', UserController.users_directlist); 

router.get('/get/count', UserController.users_count); 

router.get('/get/activeuserscount', UserController.active_users_count);

router.put('/resetpwd/:userID',UserController.update_user_resetpassword);  

router.get('/:userID',UserController.user_details); 

router.post('/searchValue',UserController.user_search);

router.post('/searchValueCount',UserController.searchValueCount); 

router.post('/officesearchValue',UserController.search_user_office); 

router.post('/statusaction',UserController.account_status); 

router.post('/roleadd',UserController.account_role_add); 

router.post('/roledelete',UserController.account_role_remove); 

router.delete('/:userID',UserController.delete_user);

router.delete('/',UserController.deleteall_user);  

router.put('/otpverification', UserController.confirm_otps);

router.get('/resendotp/:userID', UserController.resendotp);

router.patch('/:rolestatus',UserController.user_change_role); 

router.patch('/perform/action',UserController.user_performaction); 

router.post('/sendlink',UserController.send_link);  

router.get('/get/checkUserExists/:emailID', UserController.check_user_exists);

router.post('/filterUser', UserController.filterUser); 

router.post('/filterUserCount', UserController.filterUserCount); 


module.exports = router;