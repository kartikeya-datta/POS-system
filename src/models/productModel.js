const mongoose = require('mongoose');
const Inventory = require("../models/inventoryModel.js")

// Product Schema
const productSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  purchasePrice: {
    type: String,
    required: true,
  },
  sellingPrice: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number, 
    required: true,
  },
  quantityUnits: {
    type: String,
    required: true,
  },
  supplier: {
    type: String,
    trim: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});



// Pre-save hook to update inventory
productSchema.pre('save', async function(next) {
  try {
    console.log("Single product added")
    next();
  } catch (error) {
    next(error);
  }
});

// Find product by productId
productSchema.findByProductId = async function(productId) {
  return await productSchema.findOne({ productId });
};

// Find products by name
productSchema.findByName = async function(name) {
  return await productSchema.find({ name });
};

// Find products by price
productSchema.findByPrice = async function(price) {
  return await productSchema.find({ price });
};

// Product model
const Product = mongoose.model('products', productSchema);



module.exports =  Product ;
