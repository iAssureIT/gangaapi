const express 	= require("express");
const router 	= express.Router();

const customerQueryController = require('../controllers/customerQuery');

router.post('/post', customerQueryController.query_mail);

module.exports = router;