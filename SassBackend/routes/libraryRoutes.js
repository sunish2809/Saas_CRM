const express = require('express');
const { authMiddleware, checkBusinessAccess } = require('../middleware/auth');
const { 
    addLibraryMembers, 
    updateLibraryMembers, 
    deleteLibraryMembers, 
    getLibraryMembers,
    getAllLibraryMembers, 
    uploadLibraryMembers,
    getDeletedMembersStats
} = require('../controllers/library/libraryController');

const router = express.Router();

// Apply middleware to all routes
router.use(authMiddleware);
router.use(checkBusinessAccess(['LIBRARY']));

// Member management routes
router.post('/add-member', addLibraryMembers);
// Bulk addition route
router.post('/upload-members', uploadLibraryMembers);
router.put('/update-member', updateLibraryMembers);
router.delete('/delete-member/:seatNumber', deleteLibraryMembers);
router.get('/get-member/:seatNumber', getLibraryMembers);
router.get('/get-all-members', getAllLibraryMembers);
router.get('/get-deleted-member',getDeletedMembersStats)

module.exports = router;