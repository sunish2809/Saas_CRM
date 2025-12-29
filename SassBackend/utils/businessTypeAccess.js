/**
 * Business Type Access Control
 * Determines which business types a user can access based on their membership plan
 */

const BUSINESS_TYPE_LIMITS = {
  "Starter": 1, // Can access 1 business type
  "Professional": 3, // Can access all 3 business types
  "Enterprise": 3, // Can access all 3 business types
  "Lifetime": 3, // Can access all 3 business types
  // Legacy support
  "Basic": 1,
  "Intermediate": 2,
  "Pro": 3,
  "None": 1, // Trial users can access 1 business type
};

const ALL_BUSINESS_TYPES = ["GYM", "LIBRARY", "HARDWARE"];

/**
 * Get the maximum number of business types allowed for a membership plan
 * @param {string} membershipType - The membership type
 * @returns {number} - Maximum number of business types allowed
 */
function getBusinessTypeLimit(membershipType) {
  if (!membershipType) {
    return 1; // Default to 1 for trial/expired users
  }
  
  const limit = BUSINESS_TYPE_LIMITS[membershipType];
  return limit === undefined ? 1 : limit;
}

/**
 * Check if a user can access a specific business type
 * @param {Array<string>} userBusinessTypes - Array of business types the user has access to
 * @param {string} requestedBusinessType - The business type being requested
 * @param {string} membershipType - User's membership type
 * @returns {object} - { allowed: boolean, message?: string }
 */
function checkBusinessTypeAccess(userBusinessTypes, requestedBusinessType, membershipType) {
  const limit = getBusinessTypeLimit(membershipType);
  const requestedType = requestedBusinessType.toUpperCase();
  
  // Display name for membership type (treat "None" as "Starter")
  const displayMembershipType = membershipType === "None" || !membershipType ? "Starter" : membershipType;
  
  // Check if user already has access to this business type
  if (userBusinessTypes && userBusinessTypes.includes(requestedType)) {
    return {
      allowed: true,
      message: `Access granted to ${requestedType}`
    };
  }
  
  // Check if user can add more business types
  const currentCount = userBusinessTypes ? userBusinessTypes.length : 0;
  
  if (limit >= 3) {
    // Professional/Enterprise/Lifetime - can access all
    return {
      allowed: true,
      message: `Access granted to ${requestedType}. You can access all business types.`
    };
  }
  
  if (currentCount >= limit) {
    return {
      allowed: false,
      message: `Your ${displayMembershipType} plan allows access to ${limit} business type(s). You currently have access to ${currentCount} business type(s). Please upgrade to access more business types.`
    };
  }
  
  return {
    allowed: true,
    message: `Access granted to ${requestedType}`
  };
}

/**
 * Get available business types for a user based on their plan
 * @param {Array<string>} userBusinessTypes - Current business types user has access to
 * @param {string} membershipType - User's membership type
 * @returns {Array<string>} - Array of available business types
 */
function getAvailableBusinessTypes(userBusinessTypes, membershipType) {
  const limit = getBusinessTypeLimit(membershipType);
  
  if (limit >= 3) {
    // Can access all business types
    return ALL_BUSINESS_TYPES;
  }
  
  // Return only the business types the user currently has access to
  return userBusinessTypes || [];
}

/**
 * Check if user can add a new business type
 * @param {Array<string>} userBusinessTypes - Current business types
 * @param {string} newBusinessType - New business type to add
 * @param {string} membershipType - User's membership type
 * @returns {object} - { allowed: boolean, message?: string }
 */
function canAddBusinessType(userBusinessTypes, newBusinessType, membershipType) {
  const limit = getBusinessTypeLimit(membershipType);
  const currentCount = userBusinessTypes ? userBusinessTypes.length : 0;
  const newType = newBusinessType.toUpperCase();
  
  // Display name for membership type (treat "None" as "Starter")
  const displayMembershipType = membershipType === "None" || !membershipType ? "Starter" : membershipType;
  
  // Check if already has this business type
  if (userBusinessTypes && userBusinessTypes.includes(newType)) {
    return {
      allowed: false,
      message: `You already have access to ${newType}`
    };
  }
  
  // Check limit
  if (limit >= 3) {
    return {
      allowed: true,
      message: `You can add ${newType}. Your plan allows access to all business types.`
    };
  }
  
  if (currentCount >= limit) {
    return {
      allowed: false,
      message: `Your ${displayMembershipType} plan allows access to ${limit} business type(s). Please upgrade to add more business types.`
    };
  }
  
  return {
    allowed: true,
    message: `You can add ${newType}`
  };
}

module.exports = {
  getBusinessTypeLimit,
  checkBusinessTypeAccess,
  getAvailableBusinessTypes,
  canAddBusinessType,
  ALL_BUSINESS_TYPES,
  BUSINESS_TYPE_LIMITS
};

