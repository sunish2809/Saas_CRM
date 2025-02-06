import React, { FC, useEffect, useState } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import axios from "axios";
import { format, isValid, parse } from "date-fns";

// FusionCharts setup
ReactFusioncharts.fcRoot(FusionCharts, Charts);

const Analytics: FC = () => {
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

  const [chartConfigs, setChartConfigs] = useState<any>({
    totalMembers: {},
    revenue: {},
    membershipDistribution: {},
    newMembers: {},
  });

  const [monthlyTrendChart, SetMonthlyTrendChart] = useState<any>({
    monthlyPaymentTrends: {},
  });
  const [addDeleteChart, SetAddDeleteChart] = useState<any>({
    addDeleteTrends: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gym/get-all-members`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
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
                const parsedDate = new Date(
                  member.paymentHistory[0].paymentDate
                );
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
          // joinDate: member.joinDate || "N/A", // Replace with actual data if available
          joinDate: member.createdAt
            ? new Date(member.createdAt).toLocaleDateString()
            : "N/A",
        }));

        const years: any = [
          ...new Set(
            apiMembers
              .filter((member: { paymentDate: { raw: string | null } }) => {
                return member.paymentDate; // Ensure raw date exists
              })
              .map((member: { paymentDate: { raw: string } | string }) => {
                //const rawDate = member.paymentDate;
                const rawDate =
                  typeof member.paymentDate === "string"
                    ? member.paymentDate
                    : member.paymentDate.raw; // Handle both cases
                const parsedDate = parse(rawDate, "dd/MM/yyyy", new Date()); // Correctly parse DD/MM/YYYY
                return isValid(parsedDate) ? parsedDate.getFullYear() : null; // Extract year if valid
              })
              .filter((year: number | null) => year !== null) // Remove invalid years
          ),
        ].sort((a: any, b: any) => a - b);

        setAvailableYears(years);

        // Process analytics data
        const totalMembers = apiMembers.length;
        const activeMembers = apiMembers.filter(
          (member: { status: string }) => member.status === "Active"
        ).length;
        const totalRevenue = apiMembers.reduce(
          (sum: number, member: { amount: any }) => sum + member.amount,
          0
        );

        const membershipDistribution = {
          basic: apiMembers.filter(
            (member: { package: string }) => member.package === "Basic"
          ).length,
          standard: apiMembers.filter(
            (member: { package: string }) => member.package === "Standard"
          ).length,
          premium: apiMembers.filter(
            (member: { package: string }) => member.package === "Premium"
          ).length,
          annual: apiMembers.filter(
            (member: { package: string }) => member.package === "Annual"
          ).length,
        };

        // Update state
        setAnalyticsData({
          totalMembers,
          activeMembers,
          totalRevenue,
          membershipDistribution,
        });

        // Update chart configurations
        setChartConfigs({
          totalMembers: {
            type: "column2d",
            width: "100%",
            height: "400",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "Total Members",
                theme: "fusion",
                paletteColors: "#727D73", // Bar color
                bgColor: "#D0DDD0", // Background color
                canvasBgColor: "#D0DDD0", // Canvas background color
                baseFontColor: "#727D73", // Label color
                showAlternateHGridColor: 0, // Disable alternate grid color
                divLineColor: "#727D73", // Horizontal grid line color
                divLineThickness: "1", // Horizontal line thickness
                divLineDashed: "0", // Solid line (not dashed)
                yAxisNameFontColor: "#727D73", // Y-axis label color
                xAxisNameFontColor: "#727D73", // X-axis label color
                captionFontColor: "#727D73", // Caption color
                toolTipBgColor: "#D0DDD0", // Tooltip background color
                toolTipBorderColor: "#727D73", // Tooltip border color
                toolTipColor: "#727D73", // Tooltip text color
              },
              data: [{ label: "Members", value: totalMembers }],
            },
          },
          revenue: {
            type: "column2d",
            width: "100%",
            height: "400",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "Total Revenue",
                theme: "fusion",
                paletteColors: "#727D73", // Bar color
                bgColor: "#D0DDD0", // Default background color
                canvasBgColor: "#FFFFFF", // Canvas background color
                baseFontColor: "#727D73", // Label color
                showAlternateHGridColor: 0, // Disable alternate grid color
                divLineColor: "#727D73", // Horizontal grid line color
                divLineThickness: "1", // Horizontal line thickness
                divLineDashed: "0", // Solid line
                yAxisNameFontColor: "#727D73", // Y-axis label color
                xAxisNameFontColor: "#727D73", // X-axis label color
                captionFontColor: "#727D73", // Caption color
              },
              data: [{ label: "Revenue", value: totalRevenue }],
            },
          },

          membershipDistribution: {
            type: "pie3d",
            width: "100%",
            height: "400",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "Membership Distribution",
                theme: "fusion",
                paletteColors: "#727D73,#BED1CF,#EEEEEE,#FFF2E1", // Custom colors for slices
                bgColor: "#D0DDD0", // Background color for the chart
                canvasBgColor: "#FFFFFF", // Background color for the canvas area
                showBorder: 0, // Remove border around the chart
                use3DLighting: 1, // Enable 3D lighting effect
                showPercentValues: 1, // Display percentage values on slices
                decimals: 1, // Number formatting for percentage
                baseFontColor: "#727D73", // Font color for labels
                baseFontSize: "12", // Font size for labels
                captionFontColor: "#727D73", // Caption font color
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
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const addDeleteMemberStat = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gym/get-all-members`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to headers
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

        const newStats = stats.map((count, index) => ({
          month: index + 1,
          count,
        }));

        // Fetch deleted members
        const deletedMembersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gym/get-deleted-members`,
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
            deletedStats[stat._id.month - 1] = stat.count; // Use month - 1 for 0-based index
          });

        SetAddDeleteChart(() => ({
          addDeleteTrends: {
            type: "msline",
            width: "100%",
            height: "400",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: `Monthly Trend for added and deleted members (${deleteAddSelectedYear})`,
                xAxisName: "Month",
                yAxisName: "Count",
                theme: "fusion",
                bgColor: "#D0DDD0", // Overall chart background color
                canvasBgColor: "#D0DDD0", // Canvas background color (on which the graph is drawn)
                canvasBgAlpha: "100", // Make sure canvas background is fully opaque
                baseFontColor: "#727D73", // Font color
                showAlternateHGridColor: 0, // Disable alternate grid colors
                divLineColor: "#727D73", // Grid line color
                divLineThickness: "1", // Line thickness
                divLineDashed: "0", // Solid lines
                paletteColors: "#727D73, #3D3D3D", // Custom colors for datasets
                usePlotGradientColor: 0, // Disable gradients on the plot
                showCanvasBorder: 0, // Remove the border of the canvas
                yAxisNameFontColor: "#727D73", // Y-axis label color
                xAxisNameFontColor: "#727D73", // X-axis label color
                captionFontColor: "#727D73", // Caption color
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
                  seriesname: "New/Renewed Members",
                  lineColor: "#727D73",
                  anchorBgColor: "#727D73",
                  data: newStats.map((stat) => ({ value: stat.count })),
                },
                {
                  seriesname: "Deleted Members",
                  lineColor: "#3D3D3D",
                  anchorBgColor: "#3D3D3D",
                  data: deletedStats.map((count) => ({ value: count })),
                },
              ],
            },
          },
        }));
      } catch (error: any) {
        console.log(error);
      }
    };
    addDeleteMemberStat();
  }, [deleteAddSelectedYear]);

  useEffect(() => {
    const calculateMonthlyTrends = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gym/get-all-members`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );

        const monthlyPayments = response.data.reduce((acc, member) => {
          member.paymentHistory.forEach((payment) => {
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

        SetMonthlyTrendChart((prevConfigs) => ({
          ...prevConfigs,
          monthlyPaymentTrends: {
            type: "line",
            width: "100%",
            height: "400",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "Monthly Payment Trends",
                xAxisName: "Month",
                yAxisName: "Total Payments",
                theme: "fusion",
                paletteColors: "#727D73", // Bar color
                bgColor: "#D0DDD0", // Default background color
                canvasBgColor: "#FFFFFF", // Canvas background color
                baseFontColor: "#727D73", // Label color
                showAlternateHGridColor: 0, // Disable alternate grid color
                divLineColor: "#727D73", // Horizontal grid line color
                divLineThickness: "1", // Horizontal line thickness
                divLineDashed: "0", // Solid line
                yAxisNameFontColor: "#727D73", // Y-axis label color
                xAxisNameFontColor: "#727D73", // X-axis label color
                captionFontColor: "#727D73", // Caption color
              },
              data: monthlyData,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    calculateMonthlyTrends();
  }, [selectedYear]);

  return (
    <div className="p-8 min-h-screen bg-[#F0F0D7]">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#727D73]">
        Analytics Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Members */}
        <div className="bg-[#D0DDD0] shadow-lg rounded-lg p-6">
          <h3 className="text-xl text-[#727D73] font-semibold">
            Total Members
          </h3>
          <p className="text-2xl text-[#727D73] font-bold">
            {analyticsData.totalMembers}
          </p>
          <ReactFusioncharts {...chartConfigs.totalMembers} />
        </div>

        {/* Total Revenue */}
        <div className="bg-[#D0DDD0] shadow-lg rounded-lg p-6">
          <h3 className="text-xl text-[#727D73] font-semibold">
            Total Revenue
          </h3>
          <p className="text-2xl text-[#727D73] font-bold">
            ₹{analyticsData.totalRevenue}
          </p>
          <ReactFusioncharts {...chartConfigs.revenue} />
        </div>

        {/* Membership Distribution */}
        <div className="bg-[#D0DDD0] shadow-lg rounded-lg p-6">
          <h3 className="text-xl text-[#727D73] font-semibold">
            Membership Distribution
          </h3>
          <ReactFusioncharts {...chartConfigs.membershipDistribution} />
        </div>

        {/* Member Add/Delete Trends */}
        <div className="bg-[#D0DDD0] rounded-lg p-6">
          <div className="mb-4">
            <label
              htmlFor="yearFilter"
              className="text-[#727D73] mr-2 font-medium"
            >
              Select Year:
            </label>
            <select
              id="yearFilter"
              className="border border-[#727D73] rounded px-2 py-1 w-40 focus:outline-none focus:ring focus:ring-[#727D73] focus:border-[#727D73] bg-[#D0DDD0] text-[#727D73] hover:cursor-pointer"
              value={selectedYear}
              onChange={(e) => setDeleteAddSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <option
                  key={year}
                  value={year}
                  className="bg-[#D0DDD0] text-[#727D73]"
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
          <ReactFusioncharts {...addDeleteChart.addDeleteTrends} />
        </div>

        {/* Monthly Payment Trends */}
        <div className="bg-[#D0DDD0] shadow-lg rounded-lg p-6 col-span-full">
          <div className="mb-4">
            <label
              htmlFor="yearFilter"
              className="text-[#727D73] mr-2 font-medium"
            >
              Select Year:
            </label>
            <select
              id="yearFilter"
              className="border border-[#727D73] rounded px-2 py-1 w-40 focus:outline-none focus:ring focus:ring-[#727D73] focus:border-[#727D73] bg-[#D0DDD0] text-[#727D73] hover:cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <option
                  key={year}
                  value={year}
                  className="bg-[#D0DDD0] text-[#727D73]"
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
          <ReactFusioncharts {...monthlyTrendChart.monthlyPaymentTrends} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
