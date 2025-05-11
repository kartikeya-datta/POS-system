const mongoose = require('mongoose');
const dotenv=require('dotenv').config()


const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database is connected to:",connect.connection.name);
    } catch (err) {
        console.log("Unable to connect database due to Error :",err);
        throw new(err)
    }
}

module.exports = connectDb;