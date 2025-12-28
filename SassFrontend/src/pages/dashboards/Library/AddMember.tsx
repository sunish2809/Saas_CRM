import axios from 'axios';
import { useState } from 'react';
import { Plus, Loader, Upload, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import Toast from '../../../components/Toast';

interface AddMemberFormState {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  aadharNumber: string;
  emergencyContact: string;
  seatNumber: string;
  paymentAmount: string;
  paymentDate: string;
}

const AddMember = () => {
  const [formData, setFormData] = useState<AddMemberFormState>({
    name: '',
    email: '',
    phone: '',
    membershipType: 'Basic',
    dateOfBirth: '',
    gender: '',
    address: '',
    aadharNumber: '',
    emergencyContact: '',
    seatNumber: '',
    paymentAmount: '',
    paymentDate: '',
  });

  const [memberLimits, setMemberLimits] = useState({ current: 0, limit: 0, remaining: null, canAddMore: false, isUnlimited: false });
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Prepare payment history (required fields)
      const paymentHistory = [{
        amount: parseFloat(formData.paymentAmount) || 0,
        paymentDate: formData.paymentDate || new Date().toISOString().split('T')[0]
      }];
      
      const memberData = {
        ...formData,
        paymentHistory: paymentHistory
      };
      
      // Remove paymentAmount and paymentDate from the data sent to backend
      delete memberData.paymentAmount;
      delete memberData.paymentDate;
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/library/add-member`,
        memberData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({ message: 'Member added successfully!', type: 'success' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        membershipType: 'Basic',
        dateOfBirth: '',
        gender: '',
        address: '',
        aadharNumber: '',
        emergencyContact: '',
        seatNumber: '',
        paymentAmount: '',
        paymentDate: '',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.fields ? 
                            `Missing required fields: ${err.response.data.fields.join(', ')}` : 
                            'Failed to add member. Please try again.');
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/LibraryMembersTemplate.csv';
    link.download = 'LibraryMembersTemplate.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
                  } else if (headerLower.includes('seat number')) {
                    member.seatNumber = String(value).trim();
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
            `${import.meta.env.VITE_BACKEND_URL}/api/library/upload-members`,
            members,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.results) {
            const { added, errors } = response.data.results;
            if (errors.length > 0) {
              const errorMessages = errors.map((e: any) => e.message || e).join(', ');
              setToast({ 
                message: `Uploaded ${added.length} members successfully. ${errors.length} errors occurred: ${errorMessages}`, 
                type: 'error' 
              });
              console.error('Upload errors:', errors);
            } else {
              setToast({ message: `Successfully uploaded ${added.length} members!`, type: 'success' });
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          } else {
            setToast({ message: 'Members uploaded successfully!', type: 'success' });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } catch (err: any) {
          setToast({ message: err.message || 'Error processing Excel file. Please check the format.', type: 'error' });
        } finally {
          setUploading(false);
          e.target.value = '';
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      setToast({ message: err.message || 'Error reading file', type: 'error' });
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Member</h1>
        <p className="text-gray-600 mt-2">Register a new member to your library</p>
      </div>

      {/* Member Limit Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <p className="text-sm text-teal-900">
          <span className="font-semibold">Current Members:</span>{' '}
          {memberLimits.isUnlimited ? (
            <>Unlimited - You have {memberLimits.current} members</>
          ) : (
            <>
              {memberLimits.current} / {memberLimits.limit}{' '}
              {memberLimits.remaining !== null && <>({memberLimits.remaining} remaining)</>}
            </>
          )}
        </p>
      </div>


      {/* Bulk Upload Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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

      <div className="text-center text-gray-500 text-sm">OR</div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  required
                  placeholder="XXXX XXXX XXXX"
                  maxLength={12}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seat Number *</label>
                <input
                  type="text"
                  name="seatNumber"
                  value={formData.seatNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter seat number"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter full address"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Membership & Emergency */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Membership & Contact</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Membership Type *</label>
                <select
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact *</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount *</label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="reset"
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Adding Member...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          themeColor="teal"
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AddMember;