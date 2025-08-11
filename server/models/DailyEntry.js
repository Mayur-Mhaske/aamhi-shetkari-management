// models/DailyEntry.js
import mongoose from 'mongoose';

const dailyEntrySchema = new mongoose.Schema({
  srNo: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0], // yyyy-mm-dd
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      costPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid", "Partially Paid"],
    required: true,
  },
}, { timestamps: true });

const DailyEntry = mongoose.model('DailyEntry', dailyEntrySchema);
export default DailyEntry;
