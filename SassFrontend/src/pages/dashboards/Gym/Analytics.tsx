import { useState, useEffect } from 'react';
import axios from 'axios';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import { BarChart3, LineChart, TrendingUp } from 'lucide-react';

// Initialize FusionCharts
ReactFusioncharts.fcRoot(FusionCharts, Charts);

// Type assertion for ReactFusioncharts component
const ReactFC = ReactFusioncharts as any;

// Type for chart config
interface ChartConfig {
  type: string;
  width: string;
  height: string;
  dataFormat: string;
  dataSource: {
    chart: any;
    data?: any[];
    categories?: any[];
    dataset?: any[];
  };
}

const Analytics = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    newMembersThisMonth: 0,
  });
  const [chartConfigs, setChartConfigs] = useState<{
    memberGrowth: ChartConfig | {};
    revenueTrend: ChartConfig | {};
    membershipDistribution: ChartConfig | {};
  }>({
    memberGrowth: {},
    revenueTrend: {},
    membershipDistribution: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gym/get-all-members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const members = response.data;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Extract available years
        const years = [
          ...new Set(
            members
              .filter((m: any) => m.paymentHistory && m.paymentHistory.length > 0)
              .map((m: any) => new Date(m.paymentHistory[0].paymentDate).getFullYear())
          ),
        ].sort((a: any, b: any) => Number(a) - Number(b)) as number[];
        
        setAvailableYears(years.length > 0 ? years : [currentYear]);

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
            return paymentDate.getMonth() === currentMonth && 
                   paymentDate.getFullYear() === currentYear;
          }).reduce((s: number, p: any) => s + p.amount, 0);
          return sum + thisMonth;
        }, 0);

        const newMembers = members.filter((m: any) => {
          if (!m.createdAt) return false;
          const joinDate = new Date(m.createdAt);
          return joinDate.getMonth() === currentMonth && 
                 joinDate.getFullYear() === currentYear;
        }).length;

        const membershipDist = {
          Basic: members.filter((m: any) => m.membershipType === 'Basic').length,
          Standard: members.filter((m: any) => m.membershipType === 'Standard').length,
          Premium: members.filter((m: any) => m.membershipType === 'Premium').length,
          Annual: members.filter((m: any) => m.membershipType === 'Annual').length,
        };

        setAnalyticsData({
          totalMembers: members.length,
          activeMembers: activeCount,
          monthlyRevenue,
          newMembersThisMonth: newMembers,
        });

        // Member Growth Chart (Monthly breakdown for selected year)
        const monthlyStats = new Array(12).fill(0);
        members.forEach((m: any) => {
          if (m.paymentHistory && m.paymentHistory.length > 0) {
            const paymentDate = new Date(m.paymentHistory[0].paymentDate);
            if (paymentDate.getFullYear() === selectedYear) {
              monthlyStats[paymentDate.getMonth()]++;
            }
          }
        });

        setChartConfigs({
          memberGrowth: {
            type: 'column2d',
            width: '100%',
            height: '400',
            dataFormat: 'json',
            dataSource: {
              chart: {
                caption: `Member Growth - ${selectedYear}`,
                xAxisName: 'Month',
                yAxisName: 'Members',
                theme: 'fusion',
                paletteColors: '#FF6B35',
                baseFontColor: '#6B7280',
                captionFontColor: '#1F2937',
                showAlternateHGridColor: 0,
                divLineColor: '#E5E7EB',
              },
              data: [
                { label: 'Jan', value: monthlyStats[0] },
                { label: 'Feb', value: monthlyStats[1] },
                { label: 'Mar', value: monthlyStats[2] },
                { label: 'Apr', value: monthlyStats[3] },
                { label: 'May', value: monthlyStats[4] },
                { label: 'Jun', value: monthlyStats[5] },
                { label: 'Jul', value: monthlyStats[6] },
                { label: 'Aug', value: monthlyStats[7] },
                { label: 'Sep', value: monthlyStats[8] },
                { label: 'Oct', value: monthlyStats[9] },
                { label: 'Nov', value: monthlyStats[10] },
                { label: 'Dec', value: monthlyStats[11] },
              ],
            },
          },
          revenueTrend: {
            type: 'line',
            width: '100%',
            height: '400',
            dataFormat: 'json',
            dataSource: {
              chart: {
                caption: `Revenue Trend - ${selectedYear}`,
                xAxisName: 'Month',
                yAxisName: 'Revenue (₹)',
                theme: 'fusion',
                paletteColors: '#D32F2F',
                baseFontColor: '#6B7280',
                captionFontColor: '#1F2937',
                showAlternateHGridColor: 0,
                divLineColor: '#E5E7EB',
              },
              data: (() => {
                const revenueStats = new Array(12).fill(0);
                members.forEach((m: any) => {
                  m.paymentHistory?.forEach((p: any) => {
                    const paymentDate = new Date(p.paymentDate);
                    if (paymentDate.getFullYear() === selectedYear) {
                      revenueStats[paymentDate.getMonth()] += p.amount;
                    }
                  });
                });
                return [
                  { label: 'Jan', value: revenueStats[0] },
                  { label: 'Feb', value: revenueStats[1] },
                  { label: 'Mar', value: revenueStats[2] },
                  { label: 'Apr', value: revenueStats[3] },
                  { label: 'May', value: revenueStats[4] },
                  { label: 'Jun', value: revenueStats[5] },
                  { label: 'Jul', value: revenueStats[6] },
                  { label: 'Aug', value: revenueStats[7] },
                  { label: 'Sep', value: revenueStats[8] },
                  { label: 'Oct', value: revenueStats[9] },
                  { label: 'Nov', value: revenueStats[10] },
                  { label: 'Dec', value: revenueStats[11] },
                ];
              })(),
            },
          },
          membershipDistribution: {
            type: 'pie2d',
            width: '100%',
            height: '400',
            dataFormat: 'json',
            dataSource: {
              chart: {
                caption: 'Membership Distribution',
                theme: 'fusion',
                paletteColors: '#FF6B35,#D32F2F,#4CAF50,#2196F3',
                baseFontColor: '#6B7280',
                captionFontColor: '#1F2937',
                showPercentValues: 1,
                decimals: 1,
                showBorder: 0,
              },
              data: [
                { label: 'Basic', value: membershipDist.Basic },
                { label: 'Standard', value: membershipDist.Standard },
                { label: 'Premium', value: membershipDist.Premium },
                { label: 'Annual', value: membershipDist.Annual },
              ],
            },
          },
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Comprehensive gym statistics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BarChart3, title: 'Total Members', value: analyticsData.totalMembers, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { icon: TrendingUp, title: 'Active Members', value: analyticsData.activeMembers, color: 'text-green-600', bgColor: 'bg-green-50' },
          { icon: LineChart, title: 'Monthly Revenue', value: `₹${analyticsData.monthlyRevenue.toLocaleString()}`, color: 'text-orange-600', bgColor: 'bg-orange-50' },
          { icon: BarChart3, title: 'New This Month', value: analyticsData.newMembersThisMonth, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Year Selection */}
      <div className="flex items-center gap-3">
        <label htmlFor="year" className="text-sm font-medium text-gray-700">Select Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 w-40"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Member Growth Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {chartConfigs.memberGrowth && 'dataSource' in chartConfigs.memberGrowth ? (
            <ReactFC {...(chartConfigs.memberGrowth as ChartConfig)} />
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          )}
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {chartConfigs.revenueTrend && 'dataSource' in chartConfigs.revenueTrend ? (
            <ReactFC {...(chartConfigs.revenueTrend as ChartConfig)} />
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          )}
        </div>
      </div>

      {/* Membership Distribution Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Distribution</h3>
        {chartConfigs.membershipDistribution && 'dataSource' in chartConfigs.membershipDistribution ? (
          <div className="flex justify-center">
            <div style={{ width: '400px' }}>
              <ReactFC {...(chartConfigs.membershipDistribution as ChartConfig)} />
            </div>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Loading chart...
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Key Metrics</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Retention Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {analyticsData.totalMembers > 0 ? ((analyticsData.activeMembers / analyticsData.totalMembers) * 100).toFixed(1) : '0'}%
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Avg Revenue/Member</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{analyticsData.totalMembers > 0 ? (analyticsData.monthlyRevenue / analyticsData.totalMembers).toFixed(0) : '0'}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Inactive Members</p>
            <p className="text-2xl font-bold text-purple-600">{analyticsData.totalMembers - analyticsData.activeMembers}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Growth Rate</p>
            <p className="text-2xl font-bold text-orange-600">
              {analyticsData.totalMembers > 0 ? ((analyticsData.newMembersThisMonth / analyticsData.totalMembers) * 100).toFixed(1) : '0'}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;