const express = require('express');
const { authMiddleware, checkBusinessAccess } = require( '../middleware/auth');


const router = express.Router();

// Protect all library routes
router.use(authMiddleware);
//router.use(checkBusinessAccess(['LIBRARY']));

// router.get('/books', LibraryController.getBooks);
// Add other library routes...

module.exports = router;