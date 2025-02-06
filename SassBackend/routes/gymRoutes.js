


const express = require("express");
const { authMiddleware, checkBusinessAccess } = require("../middleware/auth");
const {
  addGymMember,
  updateGymMember,
  deleteGymMember,
  getGymMember,
  getAllGymMembers,
  uploadGymMembers,
  getDeletedGymMembersStats,
} = require("../controllers/gym/gymController");

const router = express.Router();

// Apply authentication & business access middleware
router.use(authMiddleware);
router.use(checkBusinessAccess(["GYM"]));

// Member management routes
router.post("/add-member", addGymMember);
router.post("/upload-members", uploadGymMembers); // Bulk upload
router.put("/update-member", updateGymMember);
router.delete("/delete-member/:memberNumber", deleteGymMember);
router.get("/get-member/:memberNumber", getGymMember);
router.get("/get-all-members", getAllGymMembers);
router.get("/get-deleted-members", getDeletedGymMembersStats);

module.exports = router;
