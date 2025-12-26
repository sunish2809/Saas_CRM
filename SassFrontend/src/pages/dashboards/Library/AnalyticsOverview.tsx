import { useEffect, useState } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { format, isValid, parse } from "date-fns";
import axios from "axios";
import { TrendingUp, Users, DollarSign, Loader } from "lucide-react";

ReactFusioncharts.fcRoot(FusionCharts, Charts, FusionTheme);

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
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [deleteAddSelectedYear, setDeleteAddSelectedYear] = useState(
    new Date().getFullYear()
  );
  const [analyticsData, setAnalyticsData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    membershipDistribution: {
      basic: 0,
      standard: 0,
      premium: 0,
      annual: 0,
    },
  });

  const [chartConfigs, setChartConfigs] = useState<{
    totalMembers: ChartConfig | {};
    revenue: ChartConfig | {};
    membershipDistribution: ChartConfig | {};
  }>({
    totalMembers: {},
    revenue: {},
    membershipDistribution: {},
  });

  const [monthlyTrendChart, SetMonthlyTrendChart] = useState<{
    monthlyPaymentTrends: ChartConfig | {};
  }>({
    monthlyPaymentTrends: {},
  });

  const [addDeleteChart, SetAddDeleteChart] = useState<{
    addDeleteTrends: ChartConfig | {};
  }>({
    addDeleteTrends: {},
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/library/get-all-members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const apiMembers = response.data.map((member: any) => ({
          id: member.seatNumber,
          name: member.name,
          memberNumber: member.seatNumber,
          email: member.email,
          phone: member.phone || "",
          package: member.membershipType,
          amount: member.paymentHistory.reduce(
            (sum: number, payment: any) => sum + payment.amount,
            0
          ),
          paymentDate: member.paymentHistory[0]?.paymentDate
            ? (() => {
                const parsedDate = new Date(member.paymentHistory[0].paymentDate);
                return isValid(parsedDate)
                  ? format(parsedDate, "dd/MM/yyyy")
                  : "N/A";
              })()
            : "N/A",
          status: member.paymentHistory[0]?.paymentDate
            ? (() => {
                const lastPaymentDate = new Date(
                  member.paymentHistory[0].paymentDate
                );
                const expiryDate = new Date(lastPaymentDate);
                expiryDate.setDate(lastPaymentDate.getDate() + 30);
                return new Date() > expiryDate ? "Inactive" : "Active";
              })()
            : "Not Active",
          joinDate: member.createdAt
            ? new Date(member.createdAt).toLocaleDateString()
            : "N/A",
          avatar: `https://avatar.iran.liara.run/public/boy?username=${member.name.replace(
            " ",
            ""
          )}`,
        }));

        const years: number[] = [
          ...new Set(
            apiMembers
              .filter((member: any) => member.paymentDate)
              .map((member: any) => {
                const rawDate = member.paymentDate;
                const parsedDate = parse(rawDate, "dd/MM/yyyy", new Date());
                return isValid(parsedDate) ? parsedDate.getFullYear() : null;
              })
              .filter((year: number | null) => year !== null) as number[]
          ),
        ].sort((a: number, b: number) => a - b);

        setAvailableYears(years);

        const totalMembers = apiMembers.length;
        const activeMembers = apiMembers.filter(
          (member: any) => member.status === "Active"
        ).length;
        const totalRevenue = apiMembers.reduce(
          (sum: number, member: any) => sum + member.amount,
          0
        );

        const membershipDistribution = {
          basic: apiMembers.filter(
            (member: any) => member.package === "Basic"
          ).length,
          standard: apiMembers.filter(
            (member: any) => member.package === "Standard"
          ).length,
          premium: apiMembers.filter(
            (member: any) => member.package === "Premium"
          ).length,
          annual: apiMembers.filter(
            (member: any) => member.package === "Annual"
          ).length,
        };

        setAnalyticsData({
          totalMembers,
          activeMembers,
          totalRevenue,
          membershipDistribution,
        });

        setChartConfigs({
          totalMembers: {
            type: "column2d",
            width: "100%",
            height: "300",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "Total Members",
                theme: "fusion",
                paletteColors: "#2563EB",
                bgColor: "#F9FAFB",
                canvasBgColor: "#FFFFFF",
                baseFontColor: "#6B7280",
                showAlternateHGridColor: 0,
                divLineColor: "#E5E7EB",
                divLineThickness: "1",
                divLineDashed: "0",
              },
              data: [{ label: "Members", value: totalMembers }],
            },
          },
          revenue: {
            type: "column2d",
            width: "100%",
            height: "300",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "Total Revenue",
                theme: "fusion",
                paletteColors: "#10B981",
                bgColor: "#F9FAFB",
                canvasBgColor: "#FFFFFF",
                baseFontColor: "#6B7280",
                showAlternateHGridColor: 0,
                divLineColor: "#E5E7EB",
                divLineThickness: "1",
                divLineDashed: "0",
              },
              data: [{ label: "Revenue (₹)", value: totalRevenue }],
            },
          },
          membershipDistribution: {
            type: "pie3d",
            width: "100%",
            height: "300",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "Membership Distribution",
                theme: "fusion",
                paletteColors: "#2563EB,#1E40AF,#3B82F6,#60A5FA",
                bgColor: "#F9FAFB",
                canvasBgColor: "#FFFFFF",
                showBorder: 0,
                use3DLighting: 1,
                showPercentValues: 1,
                baseFontColor: "#6B7280",
              },
              data: [
                { label: "Basic", value: membershipDistribution.basic },
                { label: "Standard", value: membershipDistribution.standard },
                { label: "Premium", value: membershipDistribution.premium },
                { label: "Annual", value: membershipDistribution.annual },
              ],
            },
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const addDeleteMemberStat = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/library/get-all-members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const stats = new Array(12).fill(0);
        response.data.forEach((member: any) => {
          member.paymentHistory.forEach((payment: any) => {
            const paymentDate = new Date(payment.paymentDate);
            if (paymentDate.getFullYear() === deleteAddSelectedYear) {
              stats[paymentDate.getMonth()] += 1;
            }
          });
        });

        const deletedMembersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/library/get-deleted-member`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const deletedStats = new Array(12).fill(0);
        deletedMembersResponse.data
          .filter((stat: any) => stat._id.year === deleteAddSelectedYear)
          .forEach((stat: any) => {
            deletedStats[stat._id.month - 1] = stat.count;
          });

        SetAddDeleteChart(() => ({
          addDeleteTrends: {
            type: "msline",
            width: "100%",
            height: "300",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: `Monthly Trend: Added & Deleted Members (${deleteAddSelectedYear})`,
                xAxisName: "Month",
                yAxisName: "Count",
                theme: "fusion",
                bgColor: "#F9FAFB",
                canvasBgColor: "#FFFFFF",
                baseFontColor: "#6B7280",
                showAlternateHGridColor: 0,
                divLineColor: "#E5E7EB",
                divLineThickness: "1",
                divLineDashed: "0",
                paletteColors: "#2563EB, #EF4444",
              },
              categories: [
                {
                  category: [
                    { label: "Jan" },
                    { label: "Feb" },
                    { label: "Mar" },
                    { label: "Apr" },
                    { label: "May" },
                    { label: "Jun" },
                    { label: "Jul" },
                    { label: "Aug" },
                    { label: "Sep" },
                    { label: "Oct" },
                    { label: "Nov" },
                    { label: "Dec" },
                  ],
                },
              ],
              dataset: [
                {
                  seriesname: "Added Members",
                  lineColor: "#2563EB",
                  anchorBgColor: "#2563EB",
                  data: stats.map((count) => ({ value: count })),
                },
                {
                  seriesname: "Deleted Members",
                  lineColor: "#EF4444",
                  anchorBgColor: "#EF4444",
                  data: deletedStats.map((count) => ({ value: count })),
                },
              ],
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching add/delete data:", error);
      }
    };

    addDeleteMemberStat();
  }, [deleteAddSelectedYear]);

  useEffect(() => {
    const calculateMonthlyTrends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/library/get-all-members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const monthlyPayments = response.data.reduce((acc: any, member: any) => {
          member.paymentHistory.forEach((payment: any) => {
            const paymentDate = new Date(payment.paymentDate);
            if (!isNaN(paymentDate.getTime())) {
              const year = paymentDate.getFullYear();
              const month = paymentDate.getMonth();
              const key = `${year}-${month}`;
              if (!acc[key]) acc[key] = 0;
              acc[key] += payment.amount;
            }
          });
          return acc;
        }, {});

        const monthlyData = Array.from({ length: 12 }, (_, month) => {
          const key = `${selectedYear}-${month}`;
          return {
            label: new Date(selectedYear, month, 1).toLocaleString("default", {
              month: "short",
            }),
            value: monthlyPayments[key] || 0,
          };
        });

        SetMonthlyTrendChart((prevConfigs: any) => ({
          ...prevConfigs,
          monthlyPaymentTrends: {
            type: "line",
            width: "100%",
            height: "300",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "Monthly Payment Trends",
                xAxisName: "Month",
                yAxisName: "Total Payments (₹)",
                theme: "fusion",
                paletteColors: "#2563EB",
                bgColor: "#F9FAFB",
                canvasBgColor: "#FFFFFF",
                baseFontColor: "#6B7280",
                showAlternateHGridColor: 0,
                divLineColor: "#E5E7EB",
                divLineThickness: "1",
                divLineDashed: "0",
              },
              data: monthlyData,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching monthly trends:", error);
      }
    };

    calculateMonthlyTrends();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader className="w-8 h-8 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your library performance and member metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Members Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analyticsData.totalMembers}</p>
              <p className="text-xs text-gray-500 mt-2">All registered members</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Active Members Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analyticsData.activeMembers}</p>
              <p className="text-xs text-teal-600 mt-2">
                {analyticsData.totalMembers > 0
                  ? `${Math.round((analyticsData.activeMembers / analyticsData.totalMembers) * 100)}% active`
                  : "0% active"}
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{analyticsData.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">From all members</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Total Members Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Member Overview</h2>
          {chartConfigs.totalMembers && 'dataSource' in chartConfigs.totalMembers ? (
            <ReactFC {...(chartConfigs.totalMembers as ChartConfig)} />
          ) : (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          {chartConfigs.revenue && 'dataSource' in chartConfigs.revenue ? (
            <ReactFC {...(chartConfigs.revenue as ChartConfig)} />
          ) : (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Membership Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Membership Distribution</h2>
        {chartConfigs.membershipDistribution && 'dataSource' in chartConfigs.membershipDistribution ? (
          <ReactFC {...(chartConfigs.membershipDistribution as ChartConfig)} />
        ) : (
          <div className="flex justify-center py-8">
            <Loader className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Monthly Add/Delete Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Member Trends</h2>
          <select
            value={deleteAddSelectedYear}
            onChange={(e) => setDeleteAddSelectedYear(Number(e.target.value))}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {addDeleteChart.addDeleteTrends && 'dataSource' in addDeleteChart.addDeleteTrends ? (
          <ReactFC {...(addDeleteChart.addDeleteTrends as ChartConfig)} />
        ) : (
          <div className="flex justify-center py-8">
            <Loader className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Monthly Payment Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment Trends</h2>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {monthlyTrendChart.monthlyPaymentTrends && 'dataSource' in monthlyTrendChart.monthlyPaymentTrends ? (
          <ReactFC {...(monthlyTrendChart.monthlyPaymentTrends as ChartConfig)} />
        ) : (
          <div className="flex justify-center py-8">
            <Loader className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;