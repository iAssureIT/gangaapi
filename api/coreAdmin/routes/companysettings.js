const express 	= require("express");
const router 	= express.Router();

const CompanySettingController = require('../controllers/companysettings');

router.post('/', CompanySettingController.create_companysettings);

router.get('/list',CompanySettingController.list_companysettings);

router.get('/:companysettingsID', CompanySettingController.detail_companysettings);

router.patch('/', CompanySettingController.update_companysettings);

router.patch('/:info/:action', CompanySettingController.update_companysettings);

router.delete('/:companysettingsID',CompanySettingController.delete_companysettings);

router.patch('/information', CompanySettingController.update_companysettinginfo);


module.exports = router;