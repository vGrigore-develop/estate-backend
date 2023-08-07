const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
      index: true,
    },
    price: {
      required: true,
      type: String,
      index: true,
    },
    phone: {
      required: true,
      type: String,
      index: true,
    },
    rooms: {
      required: true,
      type: Number,
    },
    location: {
      required: true,
      type: String,
    },
    city: {
      required: true,
      type: String,
    },
    flagCount: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Array,
      default: [],
    },
    removedCount: {
      type: Number,
      default: 0,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    previousPrices: {
      type: Array,
      default: [],
    },
    photos: {
      type: Array,
      default: [],
    },
    source: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
)

dataSchema.index({ title: 1, price: 1, phone: 1 }, { unique: true })
module.exports = mongoose.model('Estates', dataSchema)
