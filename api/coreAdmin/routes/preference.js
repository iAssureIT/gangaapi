const express 	= require("express");
const router 	= express.Router();

const preferenceController = require('../controllers/preference');

router.post('/post', preferenceController.create_preference);

router.get('/get/one/:preferenceID', preferenceController.one_preference);

router.patch('/get/list', preferenceController.list_preference);

router.get('/get/count', preferenceController.count_preference);

// router.delete('/delete/:projectSettingID', preferenceController.delete_projectsettings);


module.exports = router;