import { useState } from 'react';
import { getLibraryMembershipDescription, getGymMembershipDescription } from '../utils/membershipTypes';

interface MembershipTypeInfoProps {
  selectedType: string;
  businessType: 'library' | 'gym';
}

const MembershipTypeInfo: React.FC<MembershipTypeInfoProps> = ({ selectedType, businessType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getDescription = () => {
    if (businessType === 'library') {
      return getLibraryMembershipDescription(selectedType);
    } else {
      return getGymMembershipDescription(selectedType);
    }
  };

  const membershipInfo = getDescription();

  if (!membershipInfo || !selectedType) {
    return null;
  }

  return (
    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <h4 className="text-sm font-semibold text-[#727D73]">{membershipInfo.name} Membership</h4>
            <span className="ml-2 text-xs text-gray-500">({membershipInfo.duration})</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{membershipInfo.description}</p>
          
          {isExpanded && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Features:</p>
              <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                {membershipInfo.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show Details'}
        </button>
      </div>
    </div>
  );
};

export default MembershipTypeInfo;

