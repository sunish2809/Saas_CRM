import { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { format } from 'date-fns';

// Types
interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  totalRevenue: number;
  revenueGrowth: number;
  membershipDistribution: {
    basic: number;
    standard: number;
    premium: number;
    annual: number;
  };
  monthlyRevenue: MonthlyRevenue[];
  membershipTrend: MembershipTrend[];
  paymentStatus: PaymentStatus[];
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  lastYear: number;
}

interface MembershipTrend {
  month: string;
  active: number;
  expired: number;
  new: number;
}

interface PaymentStatus {
  status: string;
  value: number;
  color: string;
}

function Analytics() {
  const [timeRange, setTimeRange] = useState('year');
  const [loading, setLoading] = useState(false);

  // Mock data - Replace with API call
  const analyticsData: AnalyticsData = {
    totalMembers: 1250,
    activeMembers: 980,
    newMembersThisMonth: 45,
    totalRevenue: 125000,
    revenueGrowth: 12.5,
    membershipDistribution: {
      basic: 30,
      standard: 40,
      premium: 20,
      annual: 10
    },
    monthlyRevenue: [
      { month: 'Jan', revenue: 12000, lastYear: 10000 },
      { month: 'Feb', revenue: 15000, lastYear: 12000 },
      { month: 'Mar', revenue: 18000, lastYear: 14000 },
      // Add more months...
    ],
    membershipTrend: [
      { month: 'Jan', active: 900, expired: 100, new: 40 },
      { month: 'Feb', active: 920, expired: 95, new: 45 },
      { month: 'Mar', active: 950, expired: 90, new: 50 },
      // Add more months...
    ],
    paymentStatus: [
      { status: 'Paid', value: 85, color: '#4F46E5' },
      { status: 'Pending', value: 10, color: '#FBBF24' },
      { status: 'Overdue', value: 5, color: '#EF4444' }
    ]
  };

  const StatCard = ({ title, value, change, icon }: any) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-indigo-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your library's performance and growth</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 w-40 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="year">Last 12 Months</option>
          <option value="quarter">Last Quarter</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={analyticsData.totalMembers}
          change={8.2}
          icon={
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="Active Members"
          value={analyticsData.activeMembers}
          change={5.1}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="New Members"
          value={analyticsData.newMembersThisMonth}
          change={12.5}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        />
        <StatCard
          title="Total Revenue"
          value={`₹${analyticsData.totalRevenue.toLocaleString()}`}
          change={analyticsData.revenueGrowth}
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4F46E5" 
                name="This Year"
              />
              <Line 
                type="monotone" 
                dataKey="lastYear" 
                stroke="#94A3B8" 
                name="Last Year"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Membership Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Membership Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(analyticsData.membershipDistribution).map(([key, value]) => ({
                  name: key.charAt(0).toUpperCase() + key.slice(1),
                  value
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {Object.entries(analyticsData.membershipDistribution).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={[
                    '#4F46E5',
                    '#818CF8',
                    '#A5B4FC',
                    '#C7D2FE'
                  ][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Membership Trend */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Membership Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.membershipTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="active" 
                stackId="1" 
                stroke="#4F46E5" 
                fill="#4F46E5" 
              />
              <Area 
                type="monotone" 
                dataKey="expired" 
                stackId="1" 
                stroke="#EF4444" 
                fill="#EF4444" 
              />
              <Area 
                type="monotone" 
                dataKey="new" 
                stackId="1" 
                stroke="#10B981" 
                fill="#10B981" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.paymentStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {analyticsData.paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Section */}
      <div className="flex justify-end space-x-4">
        <button 
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          onClick={() => {/* Add export to PDF logic */}}
        >
          Export to PDF
        </button>
        <button 
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          onClick={() => {/* Add export to Excel logic */}}
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default Analytics;