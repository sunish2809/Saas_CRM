const MEMBER_LIMITS = {
  "Starter": 100,
  "Professional": 500,
  "Enterprise": null, // null means unlimited
  "Lifetime": null, // null means unlimited
  // Legacy support for old membership types
  "Basic": 100,
  "Intermediate": 500,
  "Pro": null,
  "None": 0, // Trial/Expired users
};

/**
 * Get the member limit for a given membership type
 * @param {string} membershipType - The membership type (Starter, Professional, Enterprise, Lifetime)
 * @returns {number|null} - The member limit (null for unlimited)
 */
function getMemberLimit(membershipType) {
  if (!membershipType) {
    return 0; // No membership = no limit (trial users)
  }
  
  const limit = MEMBER_LIMITS[membershipType];
  return limit === undefined ? 0 : limit;
}

/**
 * Check if a user can add more members
 * @param {number} currentMemberCount - Current number of members
 * @param {string} membershipType - User's membership type
 * @returns {object} - { allowed: boolean, limit: number, current: number, message?: string }
 */
function checkMemberLimit(currentMemberCount, membershipType) {
  const limit = getMemberLimit(membershipType);
  
  // Unlimited plan
  if (limit === null) {
    return {
      allowed: true,
      limit: null,
      current: currentMemberCount,
      message: "Unlimited members"
    };
  }
  
  // Check if limit is reached
  if (currentMemberCount >= limit) {
    return {
      allowed: false,
      limit: limit,
      current: currentMemberCount,
      message: `Member limit reached. Your ${membershipType} plan allows up to ${limit} members. Please upgrade to add more members.`
    };
  }
  
  return {
    allowed: true,
    limit: limit,
    current: currentMemberCount,
    remaining: limit - currentMemberCount,
    message: `${limit - currentMemberCount} members remaining`
  };
}

module.exports = {
  getMemberLimit,
  checkMemberLimit,
  MEMBER_LIMITS
};

