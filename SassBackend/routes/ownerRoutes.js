const express = require('express');
const { authMiddleware } = require( '../middleware/auth');
const { updateOwner, getOwner, getMemberLimits, switchBusinessType, addBusinessType } = require('../controllers/owner/ownerController');

const router = express.Router();

// Apply authentication middleware only (no business type restriction for owner routes)
router.use(authMiddleware);

router.put('/update-owner', updateOwner);
router.get('/get-owner', getOwner);
router.get('/member-limits', getMemberLimits);
router.post('/switch-business-type', switchBusinessType);
router.post('/add-business-type', addBusinessType);

module.exports = router;
