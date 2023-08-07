const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    agency: {
      type: String,
    },
    city: {
      type: String,
    },
    colleaguesList: {
      type: Array,
      default: [],
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now(),
    },
    subscriptionEndDate: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('user', userSchema)
