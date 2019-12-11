const express 	= require("express");
const router 	= express.Router();

const bulkUploadTemplateController = require('../controllers/bulkUploadTemplate');

router.post('/post/addBulkUploadTemplate', bulkUploadTemplateController.addBulkUploadTemplate);

router.patch('/patch/bulkUploadTemplate', bulkUploadTemplateController.updateBulkUploadTemplate);

router.get('/get/list', bulkUploadTemplateController.getTemplates);
	
router.get('/get/count', bulkUploadTemplateController.getTemplatesCount);

router.get('/get/:category_ID', bulkUploadTemplateController.getTemplateByCategory);

router.get('/getTemplate/:template_ID', bulkUploadTemplateController.getTemplateByID);

router.delete('/delete/:template_ID', bulkUploadTemplateController.deleteTemplate);

module.exports = router;