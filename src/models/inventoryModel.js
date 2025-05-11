const mongoose = require('mongoose');

// Inventory Schema
const inventorySchema = mongoose.Schema({
    productId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0 
    },
    units: {
      type: String,
      required: false,
      default: "Pieces",
    },
    productPrice: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt:{
      type: Date,
      default: Date.now
    }
  });

  // Inventory model
const Inventory = mongoose.model('inventory', inventorySchema);

inventorySchema.pre('save', function(next) {
    if (this.isNew) {
          next();
    } else {
      next();
    }
  });

module.exports=Inventory