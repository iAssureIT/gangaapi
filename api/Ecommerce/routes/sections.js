const express 	= require("express");
const router 	= express.Router();

const sectionsController = require('../controllers/sections');

router.post('/post', sectionsController.insert_section);

router.get('/get/list',sectionsController.get_sections);

router.get('/get/one/:sectionID',sectionsController.get_single_section);

router.patch('/patch', sectionsController.update_section);

router.delete('/delete/:sectionID',sectionsController.delete_section);

module.exports = router;