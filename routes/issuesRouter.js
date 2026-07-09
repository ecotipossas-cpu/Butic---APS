const express = require ("express")
const issuesController = require("../controllers/issuesController")

const router = express.Router()
router.route("/")
.post(issuesController.createIssue)

module.exports = router