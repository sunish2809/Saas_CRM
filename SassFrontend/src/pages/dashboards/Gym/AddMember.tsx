import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader, Upload, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const AddMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    aadharNumber: '',
    emergencyContact: '',
    membershipType: 'Basic',
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/gym/add-member`,
        {
          ...formData,
          amount: parseFloat(formData.amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/dashboard/gym/members');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const membershipTypes = ['Basic', 'Standard', 'Premium', 'Annual'];
  const genders = ['Male', 'Female', 'Other'];

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/GymMembersTemplate.csv';
    link.download = 'GymMembersTemplate.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadSuccess(false);
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            throw new Error('Excel file must have at least a header row and one data row');
          }

          const headers = (jsonData[0] as string[]).map((h: string) => h.trim());
          const dataRows = jsonData.slice(1) as any[];

          const members = dataRows
            .filter((row) => row && row.length > 0 && row[0])
            .map((row) => {
              const member: any = {};
              headers.forEach((header, colIndex) => {
                const value = row[colIndex];
                if (value !== undefined && value !== null && value !== '') {
                  const headerLower = header.toLowerCase();
                  
                  if (headerLower.includes('name')) {
                    member.name = String(value).trim();
                  } else if (headerLower.includes('email')) {
                    member.email = String(value).trim().toLowerCase();
                  } else if (headerLower.includes('phone')) {
                    member.phone = String(value).trim().replace(/\D/g, '');
                  } else if (headerLower.includes('member number')) {
                    member.memberNumber = String(value).trim();
                  } else if (headerLower.includes('date of birth') || headerLower.includes('dob')) {
                    const dateStr = String(value).trim();
                    let dateObj: Date;
                    if (dateStr.includes('/')) {
                      const [day, month, year] = dateStr.split('/');
                      dateObj = new Date(`${year}-${month}-${day}`);
                    } else {
                      dateObj = new Date(dateStr);
                    }
                    member.dateOfBirth = dateObj.toISOString().split('T')[0];
                  } else if (headerLower.includes('gender')) {
                    member.gender = String(value).trim();
                  } else if (headerLower.includes('address')) {
                    member.address = String(value).trim();
                  } else if (headerLower.includes('aadhar')) {
                    member.aadharNumber = String(value).trim().replace(/\D/g, '');
                  } else if (headerLower.includes('emergency')) {
                    member.emergencyContact = String(value).trim().replace(/\D/g, '');
                  } else if (headerLower.includes('membership type')) {
                    member.membershipType = String(value).trim();
                  } else if (headerLower.includes('payment amount')) {
                    if (value) {
                      member.paymentAmount = parseFloat(String(value)) || 0;
                    }
                  } else if (headerLower.includes('payment date')) {
                    if (value) {
                      const dateStr = String(value).trim();
                      let dateObj: Date;
                      if (dateStr.includes('/')) {
                        const [day, month, year] = dateStr.split('/');
                        dateObj = new Date(`${year}-${month}-${day}`);
                      } else {
                        dateObj = new Date(dateStr);
                      }
                      member.paymentDate = dateObj.toISOString().split('T')[0];
                    }
                  }
                }
              });

              if (member.paymentAmount || member.paymentDate) {
                member.paymentHistory = [{
                  amount: member.paymentAmount || 0,
                  paymentDate: member.paymentDate || new Date().toISOString().split('T')[0]
                }];
                delete member.paymentAmount;
                delete member.paymentDate;
              }

              return member;
            })
            .filter((member) => member.name && member.email && member.phone);

          if (members.length === 0) {
            throw new Error('No valid members found in the file. Please check the format.');
          }

          const token = localStorage.getItem('token');
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/gym/upload-members`,
            members,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.results) {
            const { added, errors } = response.data.results;
            if (errors.length > 0) {
              setUploadError(
                `Uploaded ${added.length} members successfully. ${errors.length} errors occurred. Check console for details.`
              );
              console.error('Upload errors:', errors);
            } else {
              setUploadSuccess(true);
              setTimeout(() => {
                navigate('/dashboard/gym/members');
              }, 2000);
            }
          } else {
            setUploadSuccess(true);
            setTimeout(() => {
              navigate('/dashboard/gym/members');
            }, 2000);
          }
        } catch (err: any) {
          setUploadError(err.message || 'Error processing Excel file. Please check the format.');
        } finally {
          setUploading(false);
          e.target.value = '';
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      setUploadError(err.message || 'Error reading file');
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard/gym/members')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Member</h1>
          <p className="text-gray-600 mt-1">Register a new gym member</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Upload Success Alert */}
      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Members uploaded successfully! Redirecting...
        </div>
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {uploadError}
        </div>
      )}

      {/* Bulk Upload Section */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Bulk Upload Members</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Upload multiple members at once using an Excel file. Download the template to see the required format.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Excel File'}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-blue-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Processing file...</span>
          </div>
        )}
      </div>

      <div className="mb-6 text-center text-gray-500 text-sm">OR</div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Personal Information Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
              >
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Number
              </label>
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Street, City, State"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact
            </label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Contact name and number"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
            />
          </div>
        </div>

        {/* Membership Information Section */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Membership Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="membershipType" className="block text-sm font-medium text-gray-700 mb-2">
                Membership Type *
              </label>
              <select
                id="membershipType"
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
              >
                {membershipTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="2999"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="border-t border-gray-200 pt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/gym/members')}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? 'Adding Member...' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;