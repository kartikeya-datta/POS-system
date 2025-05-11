const express=require("express")
const router = new express.Router()
const controller = require('../controllers/adminControllers.js')
const multer = require('multer');
const path = require('path');
const time = new Date();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', '..', 'tmp_files'));
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + time.getHours()+ ':' + time.getMinutes() + '_' + file.originalname)
    },
  });

const upload = multer({ storage: storage });


router.get("/test",(req,res)=>{
    res.send({
        name:"adminserver is working"
    })
})

//GET requests
router.get('/getEmployees', controller.getEmployees);
router.get('/getProducts', controller.getProducts);
router.get('/getTransactions', controller.getTransactions);
router.get('/getAnalytics', controller.getAnalytics);

// POST requests
router.post("/signup", controller.Signup) // Admin account creation
router.post("/login", controller.Login) // Admin auth
router.post("/addEmployee", controller.addEmployee)
router.post("/addProduct", controller.addProduct)
router.post("/uploadExcel", upload.single('excel'), controller.uploadExcel);
router.post("/passwordReset", controller.passwordReset);
router.post("/resetPassword", controller.resetPassword);

// PATCH requests
router.patch("/editEmp", controller.editEmployee)
router.patch("/editProduct", controller.editProduct)

// DELETE requests
router.delete("/deleteEmp", controller.deleteEmployee)
router.delete("/deleteProduct", controller.deleteProduct)
module.exports = router