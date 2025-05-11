const Employee = require('../models/employeeModel.js')
const Inventory = require('../models/inventoryModel.js')
const Transaction = require("../models/billingModel.js")
const emails = require('../emails/service.js')
const path = require('path');
const bcrypt=require("bcryptjs")
const dotenv=require('dotenv').config()
const jwt=require("jsonwebtoken")
const Jwt_Secret="thisisseceret"
const billId = require('order-id')('test');

const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//console.log(process.env.CLOUD_API_KEY)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
    
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});

const parser = multer({ storage: storage });


const uploadReceipt = async (req,res) => {
 
  console.log(req.body)
 // parser.single(req.body.pdf)
  if(req.file){
    //console.log(req.file)
    try{
      const { path:  pdfURL, filename: assetId, mimetype: type, fieldname: folder, originalname: originalName } = req.file;
      const receipt = {
          pdfURL,
          assetId,
          type,
          folder,
          originalName,
        };
       // console.log(receipt)
        const update = await Transaction.updateOne({ _id : req.body.id },  {receipt : receipt});
        console.log(update)
        await emails.sendReceiptLink(req.body.name,req.body.mail,pdfURL)
        if(update.matchedCount == 1){
          res.status(200).send({success : req.file})
        } else{
          res.status(500).send({error: "Failed to save bill in cloud"})
        }
    } catch (err) {
      console.log(err)
      res.status(500).send({error: "Failed to upload receipt into cloudinary"})
    }
} else {
  res.status(500).send({error: "Failed to upload receipt into cloudinary"})
}
}


// Endpoint for admin account authentication
const Login = async(req,res) => {
    const { email,password } = req.body
    console.log(email,password)
    try {
        const user = await Employee.findByCredentials(email,password)
       // console.log(user)
        if(user.email){
        const token = await user.genAuthToken()   
        res.send({user,token})
      }
      else res.status(400).send({error:"Email not found!"})
  
      } catch (err) {
        console.log(err);
        res.status(500).send({ errorMessage : "Failed to login Employee"})
      }
}

const passwordReset = async(req,res) => {
  const email=req.body.email
  //console.log("Email ",email)
  try{
      //console.log("inside");
      const user = await Employee.findByEmail(email)
      // console.log(user,"user in route")
      const secret=Jwt_Secret + user.password
      const payload={
          email:user.email,
          id:user.id
      }
      const token=jwt.sign(payload,secret,{expiresIn:'15m'})
      //console.log(token);
      const link=`http://localhost:${process.env.PORT || 3000}/resetpassword.html?id=${user.id}&token=${token}`
      console.log(link);
      await emails.sendPasswordResetLink(email,link)
      //console.log("secret",secret)
      //console.log("token before mail",token)
      res.send({success:"link sent"})
  }
  catch(e){
      console.log(e)
      res.send({error:"unable to reset password"})
  }
}

const resetPassword = async(req,res) => {
  //console.log(req.query)
  const { id, token } =req.query
  const password = req.body.password
  //console.log(id,"id")
  try {
      //console.log("user got it --")
      const user = await Employee.findUserById(id)
      //console.log("reached --",user)
      const secret=Jwt_Secret + user.password
      //console.log("seceret after mail",secret)
      //console.log("token after mail",token)
      const payload=jwt.verify(token,secret)
      //console.log("payload ",payload)
      // console.log("user ",user)
      user.password=password
      await user.save()
      console.log("success")
      res.status(200).send({success:"true"})
  } catch (err) {
      console.log(err)
      res.status(400).send({error: err})
  }
}

const getProducts = async (req,res) => {
  try{
    const list = await Inventory.find()
    res.status(200).send({list:list})
  } catch (err) {
      console.log(err)
      res.status(500).send({error : "Failed to get products"})
  }
}


const generateBill = async  (req,res) => {
  try{


    req.body.products = JSON.parse(req.body.products)
   // console.log(req.body)
    const saveBill = new Transaction(req.body)
    await saveBill.save()
    //console.log(saveBill)
    if(saveBill.transactionId){
      res.status(200).send({transaction: saveBill})
      // Reduce stock count in inventory
      for (const product of req.body.products) {
        await Inventory.findOneAndUpdate(
          { productId: product.productId },
          { $inc: { stock: -product.quantity } }
        );
      }
    } else {
      res.status(400).send({error: "Failed to generate bill"})
    }
    //res.send({error : "Failed"})
    //const transactionID = billId.generate()
    //console.log(transactionID)
     // Sample product data
    /* const productsData = [
      {
        productId: '1001',
        name: 'Dairy Milk',
        type: 'Chocolate',
        quantity: 4,
        price: '10.00'
      },
      {
        productId: '1002',
        name: 'Coca cola',
        type: 'Bevarage',
        quantity: 5,
        price: '25.00'
      }
    ];

    // Create a new transaction
   const newTransaction = new Transaction({
      fname: 'John',
      lname: 'Doe',
      phoneNumber: '961-839-1074',
      email: 'johndoe@example.com',
      products: productsData,
      totalPrice: '100.00',
      totalQuantity: '9',
      transactionType: 'CASH',
      employeeId: 'EMP001',
      employeeName: 'Naveen Rio',
      employeeEmail: 'naveenrio@gmail.com'
    }); */

    // Save the transaction to the database
  /*  newTransaction.save()
      .then(savedTransaction => {
        console.log('Transaction saved:', savedTransaction);
      })
      .catch(err => console.error('Error saving transaction:', err));
*/
  }  catch (err) {
      console.log(err)
      res.status(500).send({error : "Failed to generate bill"})
  }
}


module.exports = {
    Login,
    passwordReset,
    resetPassword,
    getProducts,
    generateBill,
    uploadReceipt
}