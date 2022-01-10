const express = require("express");
const router = express.Router();
const {isAuthenticatedUser} = require("../middleware/auth");
const {processPayment, sendStripeApiKey} = require("../controllers/paymentController");

router.route("/payment/process").post(function(req,res){isAuthenticatedUser, processPayment});

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;