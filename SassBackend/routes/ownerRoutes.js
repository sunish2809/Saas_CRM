const express = require('express');
const { authMiddleware, checkBusinessAccess } = require( '../middleware/auth');
const {updateOwner} = require('../controllers/owner/ownerController');


const router = express.Router();

// Protect all library routes
router.use(authMiddleware);
router.use(checkBusinessAccess(['LIBRARY']));

// router.get('/books', LibraryController.getBooks);
// Add other library routes...
router.put('/update-owner',updateOwner );

module.exports = router;