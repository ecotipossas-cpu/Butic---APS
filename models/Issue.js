const mongoose = require('mongoose')
const IssueSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: "El parametro name es obligatorio",
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
})

const Issue = mongoose.model('Issue', IssueSchema)

module.exports = Issue