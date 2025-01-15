import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipType: 'Basic' | 'Standard' | 'Premium' | 'Annual';
  amount: string;
  paymentDate: string;
  dueDate: string;
  aadharNumber: string;
  emergencyContact: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  seatNumber: string;
}

interface FormError {
  field: keyof MemberFormData;
  message: string;
}

interface UpdateFormData {
  seatNumber: string;
  membershipType: 'Basic' | 'Standard' | 'Premium' | 'Annual';
  amount: string;
  paymentDate: string;
}

function AddMember() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormError[]>([]);

  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipType: 'Basic',
    amount: '',
    paymentDate: '',
    dueDate: '',
    aadharNumber: '',
    emergencyContact: '',
    gender: 'male',
    dateOfBirth: '',
    seatNumber: ''
  });

  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    seatNumber: '',
    membershipType: 'Basic',
    amount: '',
    paymentDate: '',
  });

  const handleUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log('Update form data:', updateFormData);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({ ...prev, [name]: value }));
  };

  const membershipTypes = [
    { id: 'Basic' },
    { id: 'Standard' },
    { id: 'Premium'},
    { id: 'Annual'}
  ];

  const validateForm = (): FormError[] => {
    const newErrors: FormError[] = [];

    if (!formData.name.trim()) {
      newErrors.push({ field: 'name', message: 'Name is required' });
    }

    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!formData.phone.trim()) {
      newErrors.push({ field: 'phone', message: 'Phone number is required' });
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      newErrors.push({ field: 'phone', message: 'Invalid phone number format' });
    }

    if (!formData.aadharNumber.trim()) {
      newErrors.push({ field: 'aadharNumber', message: 'Aadhar number is required' });
    } else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/[- ]/g, ''))) {
      newErrors.push({ field: 'aadharNumber', message: 'Invalid Aadhar number format' });
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      // Add your API call here
      // await addMember(formData);
      console.log('Member data:', formData);
      navigate('/dashboard/library/members');
    } catch (error) {
      console.error('Error adding member:', error);
      setErrors([{ field: 'name' as keyof MemberFormData, message: 'Failed to add member. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for the field being changed
    setErrors(prev => prev.filter(error => error.field !== name));
  };

  const getFieldError = (fieldName: keyof MemberFormData): string => {
    return errors.find(error => error.field === fieldName)?.message || '';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Add New Member</h2>
        <p className="text-gray-600">Enter member details to create a new membership</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  getFieldError('phone') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {getFieldError('phone') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhar Number *
              </label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  getFieldError('aadharNumber') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter Aadhar number"
              />
              {getFieldError('aadharNumber') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('aadharNumber')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          <div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter complete address"
            />
          </div>
        </div>

        {/* Membership Details */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membership Type
              </label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {membershipTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seat Number
              </label>
              <input
                type="text"
                name="seatNumber"
                value={formData.seatNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div> */}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
          <div>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter emergency contact number"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding Member...' : 'Add Member'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/library/members')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
        {/* General Error Message */}
        {/* {formData.error && (
          <p className="mt-4 text-sm text-red-600">{formData.error}</p>
        )} */}
      </form>

      <div className="mb-6 mt-10">
        <h2 className="text-2xl font-semibold text-gray-800">Update Member</h2>
        <p className="text-gray-600">Enter member details to update member</p>
      </div>

      <form onSubmit={handleUpdateSubmit} className="max-w-4xl bg-white rounded-lg shadow-sm p-6 border border-gray-200">

        {/* Membership Details */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membership Type
              </label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleUpdateChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {membershipTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleUpdateChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleUpdateChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seat Number
              </label>
              <input
                type="text"
                name="seatNumber"
                value={formData.seatNumber}
                onChange={handleUpdateChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>


          </div>
        </div>

      </form>



    </div>
  );
}

export default AddMember;