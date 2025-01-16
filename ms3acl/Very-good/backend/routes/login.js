const express = require("express");
const { loginUser } = require("../controllers/loginController");
const router = express.Router();

// Remove the '/login' part to make the endpoint match your expectation
router.post("/", loginUser); // Now it will respond to POST /api/login

module.exports = router;
