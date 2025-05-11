const express = require('express')
const dotenv=require('dotenv').config()
const port = process.env.PORT || 3000
const adminRoutes = require('./Routes/adminRoutes.js')
const employeeRoutes = require('./Routes/employeeRoutes.js')
const path=require('path')
const cors = require('cors')
const helmet = require('helmet')
const connectDb = require('./DB/mongoConnection.js')
const adminModel= require('./models/adminModel.js')
const app = express()
const publicDirectoryPath=path.join(__dirname,'../public')
const adminDirectoryPath=path.join(__dirname,'../public/admin')

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes)
app.get('/test', (req,res) => {
    res.send("Server is running...");
})


// Start server only when database is connected
connectDb().then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server is started at http://localhost:${port}`);
      });
    } catch (err) {
      console.log('Unable to start server due to:', err);
    }
  });