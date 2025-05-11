const express=require("express")
const router = new express.Router()
const controller = require('../controllers/employeeControllers.js')
const dotenv=require('dotenv').config()
const multer = require("multer");
const path = require('path');
const time = new Date()
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
    
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
    folder: "retail",
    allowedFormats: ["pdf"],
    }
});


const storages = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', '..', 'tmp_files'));
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + time.getHours()+ '-' + time.getMinutes() + '_' + file.originalname)
    },
  });
  
  const upload = multer({ storage: storage });
  

router.get("/test",(req,res)=>{
    res.send({
        name:"employeeserver is working"
    })
})

//GET requests
router.get("/getProducts", controller.getProducts) // Products List

// POST requests
router.post("/login", controller.Login) // Admin auth
router.post("/passwordReset", controller.passwordReset);
router.post("/resetPassword", controller.resetPassword);
router.post("/generateBill", controller.generateBill);
router.post("/uploadReceipt",upload.single('pdf'), controller.uploadReceipt);

module.exports = router