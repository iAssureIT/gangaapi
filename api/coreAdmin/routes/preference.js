const express 	= require("express");
const router 	= express.Router();

const preferenceController = require('../controllers/preference');

router.post('/post', preferenceController.create_preference);

router.get('/get/one/:preferenceID', preferenceController.one_preference);

router.get('/get/list', preferenceController.get_preference);

router.patch('/get/list', preferenceController.list_preference);

router.patch('/patch', preferenceController.update_preference);

router.patch('/postrate', preferenceController.submit_rate_preference);

router.patch('/patchrate', preferenceController.update_rate_preference);

router.get('/get/count', preferenceController.count_preference);

router.delete('/deleterate/delete/:preferenceID/:taxRateID', preferenceController.delete_rate_preference);

router.delete('/delete/:preferenceID', preferenceController.delete_preference);


module.exports = router;