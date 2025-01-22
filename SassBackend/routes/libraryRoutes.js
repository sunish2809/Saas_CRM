const express = require('express');
const { authMiddleware, checkBusinessAccess } = require('../middleware/auth');
const { 
    addLibraryMembers, 
    updateLibraryMembers, 
    deleteLibraryMembers, 
    getLibraryMembers,
    getAllLibraryMembers, 
    uploadLibraryMembers
} = require('../controllers/library/libraryController');

const router = express.Router();

// Apply middleware to all routes
router.use(authMiddleware);
router.use(checkBusinessAccess(['LIBRARY']));

// Member management routes
console.log("code is running");
router.post('/add-member', addLibraryMembers);
// Bulk addition route
router.post('/upload-members', uploadLibraryMembers);
router.put('/update-member', updateLibraryMembers);
router.delete('/delete-member/:seatNumber', deleteLibraryMembers);
router.get('/get-member', getLibraryMembers);
router.get('/get-all-members', getAllLibraryMembers);

module.exports = router;