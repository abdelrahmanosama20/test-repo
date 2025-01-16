const express = require('express');
const { createTag, getTags, updateTag, deleteTag,getAllTagNames } = require('../controllers/tagController');
const router = express.Router();

router.get('/', getTags); // Get all tags
router.post('/create', createTag); // Create a new tag
router.patch('/update/:id', updateTag); // Update an existing tag by ID
router.delete('/deletee/:id', deleteTag); // Delete a tag by ID
router.get('/tags/names', getAllTagNames);
module.exports = router;