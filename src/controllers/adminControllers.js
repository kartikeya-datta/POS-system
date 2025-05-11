
const adminModel = require('../models/adminModel.js')
const Employee = require('../models/employeeModel.js')
const emails = require('../emails/service.js')
const  Product= require('../models/productModel.js')
const Inventory = require("../models/inventoryModel.js")
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const bcrypt=require("bcryptjs")
const dotenv=require('dotenv').config()
const jwt=require("jsonwebtoken")
const Transaction = require('../models/billingModel.js')
const Jwt_Secret="thisisseceret"

// Endpoint for admin account creation
const Signup = async(req,res) => {
    //console.log(req.body)
    const user = new adminModel(req.body)
    console.log(user)
    try {
        await user.save()
        const token = await user.genAuthToken()
        emails.adminSignup(user.email)
        //sendWelcomeEmail(user.email)
        console.log("Admin signup email sent")
        //  res.cookie("Authorization",token)     
        //  res.cookie("type","student")     
        res.status(201).send({user,token})

      } catch (err) {
        console.log(err);
        res.status(500).send({ errorMessage : "Failed to signup admin"})
      }
}

// Endpoint for admin account authentication
const Login = async(req,res) => {
  const { email,password } = req.body
  console.log(email,password)
  try {
      const user = await adminModel.findByCredentials(email,password)
     // console.log(user)
      if(user.email){
      const token = await user.genAuthToken()   
      res.send({user,token})
    }
    else res.status(400).send({error:"Email not found!"})

    } catch (err) {
      console.log(err);
      res.status(500).send({ errorMessage : "Failed to login admin"})
    }
}

const addEmployee = async(req,res) => {
  req.body.password = req.body.name.split(' ')[0]+'123'
  const user = new Employee(req.body)
  console.log(user)
  try {
      await user.save()
      const token = await user.genAuthToken()
      emails.sendStaffCredentials(user.email,req.body.password)
      //sendWelcomeEmail(user.email)
      console.log("Employee signup email sent")
      //  res.cookie("Authorization",token)     
      //  res.cookie("type","student")     
      res.status(201).send({user,token})

    } catch (err) {
      console.log(err);
      res.status(500).send({ errorMessage : "Failed to create employee login"})
    }
}

const getEmployees = async(req,res) => {
  try{
    const users = await Employee.find()
    res.status(200).send({users:users})
  } catch (err) {
    console.log(err);
    res.status(500).send({ errorMessage : "Failed to get employees list" })
  }
}

const editEmployee = async(req,res) => {
  try{
    const emp = await Employee.findUserById(req.body.id)
    if(emp.email !== req.body.email ){
      const newpass = req.body.name.split(' ')[0]+'123'
      req.body.password = await bcrypt.hash(newpass,8)
      console.log(req.body)
      const updateEmp = await Employee.updateOne({ _id : req.body.id }, { $set: req.body});
      if(updateEmp.matchedCount == 0){
        res.status(400).send({error : "Failed to edit employee details"});
        throw new Error("Employee not found");
    } else {
        await emails.sendStaffCredentials(req.body.email, newpass)
        res.status(200).send({success : "employee data updated successfully"})
    }
      
    } else {
      const updateEmp = await Employee.updateOne({ _id : req.body.id },  {name : req.body.name});
      console.log(updateEmp)
      if(updateEmp.matchedCount == 0){
          res.status(400).send({error : "Failed to edit employee details"});
          throw new Error("Employee not found");
      } else {
          res.status(200).send({success : "employee data updated successfully"})
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({error : "Failed to edit employee details"})
  }
}

const deleteEmployee = async (req,res) => {
  try{
      const employeeId = req.body.id
      if(employeeId){
        const deleteEmp = await Employee.deleteOne({_id:employeeId})
        console.log(deleteEmp)
        res.status(200).send({success : "Employee deleted successfully"})
      }
  }  catch (err) {
    console.log(err);
    res.status(500).send({error : "Failed to delete employee details"})
  }
}

const addProduct = async (req,res) => {

  const product = new Product(req.body)
  console.log(product)

  try{
    const existingInventoryProduct = await Inventory.findOne({ productId : req.body.productId });

    if (existingInventoryProduct) {
      // If product already exists in inventory
      console.log("stocks update ->", existingInventoryProduct.stock + parseInt(req.body.quantity))
      existingInventoryProduct.stock += parseInt(req.body.quantity);
      existingInventoryProduct.productPrice = parseInt(req.body.sellingPrice);
      existingInventoryProduct.name = req.body.name;
      existingInventoryProduct.type = req.body.type;
      existingInventoryProduct.units = req.body.quantityUnits;
      await existingInventoryProduct.save();
    } else {
      // If product doesn't exist in inventory, create a new entry
      await Inventory.create({
        productId: req.body.productId,
        name: req.body.name,
        type: req.body.type,
        stock: parseInt(req.body.quantity),
        units: req.body.quantityUnits,
        productPrice: req.body.sellingPrice 
      });
      console.log("product added to inventory")
    }

    await product.save()
    console.log("Product added successfully")   
    res.status(201).send({success:"Product added successfully"})

  } catch (err) {
    console.log(err);
    res.status(500).send({ errorMessage : "Failed to add product" })
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

const editProduct = async(req,res) => {
  try{
      console.log(req.body)
      const updateProduct = await Inventory.updateOne({ _id : req.body.id, productId : req.body.productId }, { $set: req.body});
      console.log(updateProduct)
      if(updateProduct.matchedCount == 0){
        res.status(400).send({error : "Failed to edit product details"});
       // throw new Error("Product not found");
        return;
      } else {
        res.status(200).send({success : "Product data updated successfully"})
      } 
  } catch (err) {
    console.log(err);
    res.status(500).send({error : "Failed to edit product details"})
  }
}

const deleteProduct = async (req,res) => {
  try{
      const productId = req.body.id
      if(productId){
        const deleteProduct = await Inventory.deleteOne({_id:productId})
        console.log(deleteProduct)
        res.status(200).send({success : "Product deleted successfully"})
      }
  }  catch (err) {
    console.log(err);
    res.status(500).send({error : "Failed to delete product details"})
  }
}

const uploadExcel = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', '..', 'tmp_files', req.file.filename);
    const rows = await readXlsxFile(filePath);

    // Remove the header row
    rows.shift();

    if (rows.length === 0) {
      return res.status(200).json({ message: 'No products found in the Excel file.' });
    }

    // Process each row from the Excel file
    for (const row of rows) {
      const [productId, type, name, category, purchasePrice, sellingPrice, quantity, quantityUnits, supplier] = row;
     // let Id = productId;
        console.log(productId , " - ",quantity)
        // Update the inventory
        const existingInventoryProduct = await Inventory.findOne({ productId });

        if (existingInventoryProduct) {
           console.log("Exist prod - ", existingInventoryProduct)
          // If the product exists in the inventory, update its stock
          console.log("stocks update -> ", name , " - " , Number(existingInventoryProduct.stock) + Number(quantity))
          let quant = Number(existingInventoryProduct.stock) + Number(quantity)
          existingInventoryProduct.stock = quant;
          existingInventoryProduct.productPrice = parseInt(sellingPrice);
          existingInventoryProduct.name = name;
          existingInventoryProduct.type = type;
          existingInventoryProduct.units = quantityUnits;
         // console.log(existingInventoryProduct)
          await existingInventoryProduct.save();
        } else {
          // If the product doesn't exist in the inventory, create a new entry
          console.log("Product not exist - ", productId)
          await Inventory.create({
            productId:productId,
            name: name,
            type: type,
            stock: parseInt(quantity),
            units: quantityUnits,
            productPrice: sellingPrice // Assuming purchasePrice is the product price
          });
        }

        await Product.create({
          productId,
          type,
          name,
          category,
          purchasePrice,
          sellingPrice,
          quantity,
          quantityUnits,
          supplier
        });
      
    }

    res.status(200).json({ success: 'Products uploaded successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading products.' });
  }
};


const passwordReset = async(req,res) => {
  const email=req.body.email
  //console.log("Email ",email)
  try{
      //console.log("inside");
      const user = await adminModel.findByEmail(email)
      // console.log(user,"user in route")
      const secret=Jwt_Secret + user.password
      const payload={
          email:user.email,
          id:user.id
      }
      const token=jwt.sign(payload,secret,{expiresIn:'15m'})
      //console.log(token);
      const link=`http://localhost:${process.env.PORT || 3000}/admin/resetpassword.html?id=${user.id}&token=${token}`
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
      const adminUser = await adminModel.findUserById(id)
      //console.log("reached --",adminUser)
      const secret=Jwt_Secret + adminUser.password
      //console.log("seceret after mail",secret)
      //console.log("token after mail",token)
      const payload=jwt.verify(token,secret)
      //console.log("payload ",payload)
      // console.log("adminUser ",adminUser)
      adminUser.password=password
      await adminUser.save()
      console.log("success")
      res.status(200).send({success:"true"})
  } catch (err) {
      console.log(err)
      res.status(400).send({error: err})
  }
}

const getTransactions = async (req,res) => {
  try{
    const list = await Transaction.find()
    res.status(200).send({list:list})
  } catch (err) {
    console.log(err)
    res.status(500).send({error : "Failed to get transactions"})
  }
}

const uploadReceipt = async (req,res) => {
  if(req.file){
    try{
      const { path:  pdfURL, filename: assetId, mimetype: type, fieldname: folder, originalname: originalName } = req.file;
      const receipt = {
          pdfURL,
          assetId,
          type,
          folder,
          originalName,
        };
        const bill = Transaction.findById({_id : req.body.id})
        if(bill){
          bill.receipt = receipt
          await bill.save()
        }
    } catch (err) {
      console.log(err)
      res.status(500).send({error: "Failed to upload receipt into cloudinary"})
    }
} else {
  res.status(500).send({error: "Failed to upload receipt into cloudinary"})
}
}

const getAnalytics = async (req,res) => {
  try{
    const prod = await Product.find()
    const sales = await Transaction.find()
    const inventory = await Inventory.find()
    if(prod){
      res.status(200).send({prod: prod, sales: sales, inventory: inventory})
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({error : "Failed to get reports"})
  }
}

module.exports = {
    Signup,
    Login,
    addEmployee,
    getEmployees,
    editEmployee,
    deleteEmployee,
    addProduct,
    getProducts,
    editProduct,
    deleteProduct,
    uploadExcel,
    passwordReset,
    resetPassword,
    getTransactions,
    getAnalytics
}