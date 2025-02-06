const express = require('express');
const { authMiddleware, checkBusinessAccess } = require( '../middleware/auth');
const { updateOwner } = require('../controllers/owner/ownerController');
const {getOwner} = require('../controllers/owner/ownerController')

const router = express.Router();

// Apply middleware
router.use(authMiddleware);
router.use(checkBusinessAccess(['LIBRARY', 'GYM', 'FLAT'])); 

router.put('/update-owner', updateOwner);
router.get('/get-owner', getOwner);

module.exports = router;
