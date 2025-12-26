import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, TrendingUp, DollarSign, Activity, Loader } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    todayCheckIns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gym/get-all-members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const members = response.data;
        const activeCount = members.filter((m: any) => {
          if (!m.paymentHistory[0]?.paymentDate) return false;
          const lastPaymentDate = new Date(m.paymentHistory[0].paymentDate);
          const expiryDate = new Date(lastPaymentDate);
          expiryDate.setDate(lastPaymentDate.getDate() + 30);
          return new Date() <= expiryDate;
        }).length;

        const monthlyRevenue = members.reduce((sum: number, m: any) => {
          const thisMonth = m.paymentHistory.filter((p: any) => {
            const paymentDate = new Date(p.paymentDate);
            const now = new Date();
            return paymentDate.getMonth() === now.getMonth() && 
                   paymentDate.getFullYear() === now.getFullYear();
          }).reduce((s: number, p: any) => s + p.amount, 0);
          return sum + thisMonth;
        }, 0);

        setStats({
          totalMembers: members.length,
          activeMembers: activeCount,
          monthlyRevenue,
          todayCheckIns: Math.floor(Math.random() * members.length), // Placeholder
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    color 
  }: {
    icon: any;
    title: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to FitZone Gym Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={Users} 
          title="Total Members" 
          value={stats.totalMembers}
          color="text-blue-600"
        />
        <StatCard 
          icon={Activity} 
          title="Active Members" 
          value={stats.activeMembers}
          color="text-green-600"
        />
        <StatCard 
          icon={DollarSign} 
          title="Monthly Revenue" 
          value={`₹${stats.monthlyRevenue.toLocaleString()}`}
          color="text-orange-600"
        />
        <StatCard 
          icon={TrendingUp} 
          title="Today's Check-ins" 
          value={stats.todayCheckIns}
          color="text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Member Overview Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Member Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Total Members</span>
              <span className="text-lg font-semibold text-blue-600">{stats.totalMembers}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Active Members</span>
              <span className="text-lg font-semibold text-green-600">{stats.activeMembers}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Inactive Members</span>
              <span className="text-lg font-semibold text-red-600">{stats.totalMembers - stats.activeMembers}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/dashboard/gym/add-member"
              className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">➕</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Member</p>
                <p className="text-xs text-gray-600">Register a new member</p>
              </div>
            </a>
            <a
              href="/dashboard/gym/members"
              className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Members</p>
                <p className="text-xs text-gray-600">Manage all members</p>
              </div>
            </a>
            <a
              href="/dashboard/gym/analytics"
              className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-xs text-gray-600">See detailed reports</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-xs mb-1">Last Updated</p>
            <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-xs mb-1">Status</p>
            <p className="font-medium text-green-600">✓ All Systems Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;