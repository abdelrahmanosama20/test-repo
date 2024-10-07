const express = require('express');
const { createAdmin } = require('../controllers/adminController');
const router = express.Router();



// POST new Admin
router.post('/', createAdmin);

module.exports = router;
