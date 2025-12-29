import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalBills: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch products
        const productsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/hardware/products`,
          { headers }
        );
        
        // Fetch customers
        const customersRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/hardware/customers`,
          { headers }
        );

        setStats({
          totalProducts: productsRes.data.length,
          totalCustomers: customersRes.data.length,
          totalBills: customersRes.data.reduce((sum: number, c: any) => sum + (c.bills?.length || 0), 0),
          totalRevenue: customersRes.data.reduce((sum: number, c: any) => sum + (c.paidAmount || 0), 0),
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
      path: '/dashboard/hardware/products',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: '👥',
      color: 'bg-green-500',
      path: '/dashboard/hardware/customers',
    },
    {
      title: 'Total Bills',
      value: stats.totalBills,
      icon: '🧾',
      color: 'bg-purple-500',
      path: '/dashboard/hardware/customers',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-orange-500',
      path: '/dashboard/hardware/customers',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hardware Management Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your products, customers, and bills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <button
            key={index}
            onClick={() => navigate(stat.path)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/hardware/bill')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
            >
              Create New Bill
            </button>
            <button
              onClick={() => navigate('/dashboard/hardware/manage-stock')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left"
            >
              Add New Product
            </button>
            <button
              onClick={() => navigate('/dashboard/hardware/update-stock')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left"
            >
              Update Stock
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Manage your hardware inventory efficiently</p>
            <p>• Track customer purchases and payments</p>
            <p>• Monitor stock levels for all products</p>
            <p>• Generate bills with multiple products</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

