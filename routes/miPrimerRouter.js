const express = require ("express")
const miPrimerController = require("../controllers/miPrimerController")

const router = express.Router()
router.route("/")
.get(miPrimerController.miPrimerEndpoint)
.post(miPrimerController.miSegundoEndpoint)

router.route("/:id").get(miPrimerController.miTercerEndpoint)

module.exports = router