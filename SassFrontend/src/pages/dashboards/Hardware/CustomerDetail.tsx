import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Bill {
  _id: string;
  items: any[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  billDate: string;
}

interface Customer {
  _id: string;
  name: string;
  phoneNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  bills: any[];
}

function CustomerDetail() {
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingDues, setUpdatingDues] = useState(false);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  useEffect(() => {
    if (phoneNumber) {
      fetchCustomerData();
    }
  }, [phoneNumber]);

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [customerRes, billsRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/hardware/customers/${phoneNumber}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/hardware/bills/${phoneNumber}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      setCustomer(customerRes.data);
      setBills(billsRes.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDues = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paidAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setUpdatingDues(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/hardware/customers/dues`,
        {
          phoneNumber,
          paidAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Dues updated successfully!');
      setPaidAmount(0);
      fetchCustomerData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating dues');
    } finally {
      setUpdatingDues(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Customer not found</p>
        <button
          onClick={() => navigate('/dashboard/hardware/customers')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="mt-2 text-gray-600">Phone: {customer.phoneNumber}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/hardware/customers')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      {/* Customer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">₹{customer.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Paid Amount</p>
          <p className="text-2xl font-bold text-green-600 mt-2">₹{customer.paidAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Due Amount</p>
          <p className="text-2xl font-bold text-red-600 mt-2">₹{customer.dueAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Update Dues */}
      {customer.dueAmount > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Dues</h2>
          <form onSubmit={handleUpdateDues} className="flex gap-4">
            <input
              type="number"
              min="0"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              placeholder="Enter amount paid"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={updatingDues}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {updatingDues ? 'Updating...' : 'Update Dues'}
            </button>
          </form>
        </div>
      )}

      {/* Past Bills */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Purchases & Bills</h2>
        {bills.length === 0 ? (
          <p className="text-gray-600">No bills found</p>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div key={bill._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Bill Date: {new Date(bill.billDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total: ₹{bill.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-green-600">Paid: ₹{bill.paidAmount.toFixed(2)}</p>
                    {bill.dueAmount > 0 && (
                      <p className="text-sm text-red-600">Due: ₹{bill.dueAmount.toFixed(2)}</p>
                    )}
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                  <ul className="space-y-1">
                    {bill.items.map((item: any, index: number) => (
                      <li key={index} className="text-sm text-gray-600">
                        {item.productName} - {item.quantity} x {item.count} = ₹{item.totalPrice.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDetail;

