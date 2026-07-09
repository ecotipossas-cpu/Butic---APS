const Issue = require('../models/Issue')

const createIssue = async (req, res, next) => {
  try {
    const issue = await Issue.create(req.body)
    res.status(201).json({
      status: 'success',
      data: issue,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: 'error', message: error })
  }
}

module.exports = {
  createIssue,
}