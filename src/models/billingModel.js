const mongoose = require('mongoose');
const Inventory = require('./inventoryModel.js')
// transactionSchema
const transactionSchema = mongoose.Schema({
  transactionId: {
    type: String,
    unique: true
  },
  fname: {
    type: String,
    required: true,
    trim: true
  },
  lname: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, required: true },
      quantity: { type: Number, required: true },
      productPrice: { type: String, required: true }
    }
  ],
  totalQuantity: {
    type: String,
    trim: true,
    required: true
  },
  totalPrice: {
    type: String,
    trim: true
  },
  transactionType:{
    type: String,
  },
  employeeName: {
    type: String,
    required: false
  },
  employeeMail: {
    type: String,
    required: false
  },
  billDate: {
    type: Date,
    default: Date.now,
  },
  receipt: {
    pdfURL: {
      type: String,
      trim: true
    },
    assetId: {
      type: String,
      trim: true
    },
    folder: {
      type: String,
      trim: true
    },
    originalName: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      trim: true
    }
  }
});

// Counter schema
const counterSchema = mongoose.Schema({
  _id: { type: String, default: 'transactionId' },
  seq: { type: Number, default: 0 }
});

// Create a Counter model
const Counter = mongoose.model('Counter', counterSchema);
// Pre-save hook to auto-increment transactionId
// Pre-save hook to auto-increment transactionId 
transactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate({ _id: 'transactionId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
      const seq = counter.seq.toString().padStart(4, '0'); // Pad the sequence number with leading zeros
      this.transactionId = 'BILL-' + seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});




// Find product by productId
transactionSchema.findByTransactionId = async function(productId) {
    return await transactionSchema.findOne({ transactionId });
};

// Find products by name
transactionSchema.findByName = async function(name) {
    return await transactionSchema.find({ name });
};

// Find transaction by price
transactionSchema.findByPrice = async function(price) {
    return await transactionSchema.find({ price });
};

// Create a transactionSchema model
const Transaction= mongoose.model('transactions', transactionSchema);

module.exports = Transaction;