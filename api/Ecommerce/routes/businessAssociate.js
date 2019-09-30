const express 	= require("express");
const router 	= express.Router();

const baController = require('../controllers/businessAssociate');

router.post('/post', baController.insert_ba);

router.patch('/patch', baController.update_ba);
 
router.patch('/patch/updateBaLoc', baController.update_ba_loc);

router.post('/post/singleLocation',baController.singleLocation);

router.post('/post/singleContact',baController.singleContact);

router.patch('/patch/updateOneBaLoc', baController.update_ba_loc_one);

router.patch('/patch/updateBaContact', baController.update_ba_contact);

router.patch('/patch/updateOneBaContact', baController.update_ba_contact_one);

router.get('/get/list',baController.list_ba);

router.get('/get/checkBAExists/:emailID', baController.check_ba_exists);

router.get('/get/one/:baID', baController.single_ba);

router.delete('/delete/:baID',baController.delete_ba);

router.patch('/deleteLocation/:baID/:locationID',baController.delete_location);

router.patch('/deleteContact/:baID/:contactID',baController.delete_contact);
module.exports = router;