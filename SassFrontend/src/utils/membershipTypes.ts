/**
 * Membership type descriptions for Library Management
 */
export const libraryMembershipTypes = {
  Basic: {
    name: "Basic",
    description: "Entry-level membership with access to basic library facilities and services.",
    features: [
      "Access to general reading area",
      "Basic book borrowing (limited books)",
      "Standard borrowing period",
      "Basic library services"
    ],
    duration: "Monthly"
  },
  Standard: {
    name: "Standard",
    description: "Enhanced membership with more borrowing privileges and extended access.",
    features: [
      "Access to all reading areas",
      "Increased book borrowing limit",
      "Extended borrowing period",
      "Priority book reservations",
      "Access to study rooms"
    ],
    duration: "Monthly"
  },
  Premium: {
    name: "Premium",
    description: "Premium membership with maximum benefits and exclusive access to premium services.",
    features: [
      "Unlimited book borrowing",
      "Longest borrowing period",
      "Priority access to new books",
      "Exclusive access to premium study areas",
      "Extended library hours access",
      "Free access to digital resources"
    ],
    duration: "Monthly"
  },
  Annual: {
    name: "Annual",
    description: "Yearly membership with all premium benefits at a discounted annual rate.",
    features: [
      "All Premium membership benefits",
      "Best value for long-term members",
      "One-time annual payment",
      "Priority customer support",
      "Special discounts on library events"
    ],
    duration: "Yearly"
  }
};

/**
 * Membership type descriptions for Gym Management
 */
export const gymMembershipTypes = {
  Basic: {
    name: "Basic",
    description: "Entry-level gym membership with access to basic facilities and equipment.",
    features: [
      "Access to gym floor",
      "Basic equipment usage",
      "Standard gym hours",
      "Locker room access"
    ],
    duration: "Monthly"
  },
  Standard: {
    name: "Standard",
    description: "Enhanced membership with additional facilities and extended access.",
    features: [
      "Access to all gym equipment",
      "Extended gym hours",
      "Group fitness classes included",
      "Personal trainer consultation (limited)",
      "Locker and towel service"
    ],
    duration: "Monthly"
  },
  Premium: {
    name: "Premium",
    description: "Premium membership with maximum benefits and exclusive access to all facilities.",
    features: [
      "Access to all gym facilities",
      "24/7 gym access",
      "Unlimited group fitness classes",
      "Personal trainer sessions included",
      "Spa and sauna access",
      "Nutrition consultation",
      "Priority booking for classes"
    ],
    duration: "Monthly"
  },
  Annual: {
    name: "Annual",
    description: "Yearly membership with all premium benefits at a discounted annual rate.",
    features: [
      "All Premium membership benefits",
      "Best value for long-term members",
      "One-time annual payment",
      "Free fitness assessment",
      "Special discounts on supplements and merchandise"
    ],
    duration: "Yearly"
  }
};

/**
 * Get membership type description for Library
 */
export const getLibraryMembershipDescription = (type: string) => {
  return libraryMembershipTypes[type as keyof typeof libraryMembershipTypes] || null;
};

/**
 * Get membership type description for Gym
 */
export const getGymMembershipDescription = (type: string) => {
  return gymMembershipTypes[type as keyof typeof gymMembershipTypes] || null;
};

