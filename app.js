	const express 						= require ('express');
	const app 							= express();
	const morgan 						= require('morgan');// morgan call next function if problem occure
	const bodyParser 					= require('body-parser');// this package use to formate json data 
	const mongoose 						= require ('mongoose');
	var nodeMailer						= require('nodemailer');
	const globalVariable				= require('./nodemon');
	// const dbname = "ecommerceapi";
	// global.JWT_KEY = "secret";

	
	// const { SitemapStream, streamToPromise } = require('sitemap/dist/index')
	// // Creates a sitemap object given the input configuration with URLs
	// const sitemap = new SitemapStream({ hostname: 'http://qaapi.gangaexpress.in' });
	// sitemap.write({ url: '/page-1/', changefreq: 'daily', priority: 0.3 })
	// sitemap.write('/page-2')
	// sitemap.end()
	 
	// streamToPromise(sitemap)
	//   .then(sm => console.log(sm.toString()))
	//   .catch(console.error);


// console.log("globalVariable.dbname",dbname);
	mongoose.connect('mongodb://localhost/'+globalVariable.dbname,{
	// mongoose.connect('mongodb://localhost/'+dbname,{
		useNewUrlParser: true
	})
	mongoose.promise = global.Promise;

	app.use(morgan("dev"));
	app.use('/uploads', express.static('uploads'));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		if (req.method === "OPTIONS") {
			res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
			return res.status(200).json({});
		}
		next();
	});

	// Routes which should handle requests
	
	const usersRoutes				= require("./api/coreAdmin/routes/users.js");
	const rolesRoutes				= require("./api/coreAdmin/routes/roles");

	// const notificationRoutes 		= require("./api/coreAdmin/routes/notification");
	const companySettingRoutes		= require("./api/coreAdmin/routes/companysettings");
	const notificationRoutes		= require("./api/coreAdmin/routes/masternotifications");

	const productsRoutes			= require("./api/Ecommerce/routes/products"); 
	const categoryRoutes			= require("./api/Ecommerce/routes/categories"); 
	const ordersRoutes				= require("./api/Ecommerce/routes/orders"); 
	const vendorsRoutes				= require("./api/Ecommerce/routes/vendors"); 
	const vendorCategoryRoutes		= require("./api/Ecommerce/routes/vendorCategory"); 
	const vendorLocationTypeRoutes	= require("./api/Ecommerce/routes/vendorLocationType"); 
	const cartsRoutes				= require("./api/Ecommerce/routes/cart"); 
	const wishlistRoutes			= require("./api/Ecommerce/routes/wishlist"); 
	const projectSettingsurl 		= require("./api/coreAdmin/routes/projectSettings");
	const preferenceurl 			= require("./api/coreAdmin/routes/preference");
	const BARoutes					= require("./api/Ecommerce/routes/businessAssociate"); 
	const customerQueryRoutes		= require("./api/Ecommerce/routes/customerQuery"); 
	const customerReviewRoutes		= require("./api/Ecommerce/routes/customerReview"); 
	const SectionRoutes				= require("./api/Ecommerce/routes/sections"); 
	const ReturnedProductsRoutes	= require("./api/Ecommerce/routes/returnedProducts"); 
	const BulkUploadTemplate		= require("./api/Ecommerce/routes/bulkUploadTemplate"); 

	app.use("/api/users",usersRoutes);
	app.use("/api/roles",rolesRoutes);
	app.use("/api/projectSettings",projectSettingsurl);
	// app.use("/api/notifications",notificationRoutes);
	app.use("/api/companysettings",companySettingRoutes);
	app.use("/api/masternotifications",notificationRoutes);
	app.use("/api/preference",preferenceurl);
	app.use("/api/products", productsRoutes);
	app.use("/api/category", categoryRoutes);
	app.use("/api/orders", ordersRoutes);
	app.use("/api/wishlist", wishlistRoutes);
	app.use("/api/vendors", vendorsRoutes);
	app.use("/api/vendorCategory", vendorCategoryRoutes);
	app.use("/api/vendorLocationType", vendorLocationTypeRoutes);
	app.use("/api/carts", cartsRoutes);
	app.use("/api/businessassociates", BARoutes);
	app.use("/api/customerQuery", customerQueryRoutes);
	app.use("/api/customerReview", customerReviewRoutes);
	app.use("/api/sections", SectionRoutes);
	app.use("/api/returnedProducts", ReturnedProductsRoutes);
	app.use("/api/bulkUploadTemplate", BulkUploadTemplate);

	app.post('/send-email', (req, res)=> {
        console.log('send mail');
        let transporter = nodeMailer.createTransport({
            service : 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'iassureit.webmaster@gmail.com',
				pass: 'iAssureIT@123'
            }
        });
        console.log('after transport');
        let mailOptions = {
            
            from   : '"GangaExpress" <iassureit.webmaster@gmail.com>', // sender address
            to     : req.body.email, // list of receivers
            subject: req.body.subject, // Subject line
            text   : req.body.text, // plain text body
			html   : req.body.mail // html body
        };
        console.log('after mailoption');
        //name email mobilenumber message
        // console.log("mailOptions",mailOptions);
        
        transporter.sendMail(mailOptions, (error, info) => {
            console.log('in mail');
            if (error) {
                
                console.log("send mail error",error);
                return "Failed";
            }
            if(info){
                console.log('in info');
                // return "Success";
                res.status(200).json({
                    
                    message: "Success",
                    // return "Success",

                });
            }
    
            res.render('index');
        });
    });
	app.use((req, res, next) => {
		const error = new Error("Not found");
		error.status = 404;
		next(error);
	});

	app.use((error, req, res, next) => {
		res.status(error.status || 500);
		res.json({
				error: {
				message: error.message
				}
			});
	});

	module.exports = app;