const mongoose = require('mongoose')
const IssueSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
})

const Issue = mongoose.model('Issue', IssueSchema)

module.exports = Issue