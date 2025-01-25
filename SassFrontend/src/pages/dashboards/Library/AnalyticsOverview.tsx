import { useEffect, useState } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { format, isValid, parse} from "date-fns";
import axios from "axios";

ReactFusioncharts.fcRoot(FusionCharts, Charts, FusionTheme);

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
    newMembersThisMonth: 0,
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

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day); // Months are 0-based in JavaScript
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const response = await axios.get(
          "http://localhost:3000/api/library/get-all-members",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to headers
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

          avatar: `https://avatar.iran.liara.run/public/boy?username=${member.name.replace(
            " ",
            ""
          )}`,
        }));

        const years :any= [
          ...new Set(
            apiMembers
              .filter((member: { paymentDate: { raw: string | null } }) => {
                return member.paymentDate; // Ensure raw date exists
              })
              .map((member: { paymentDate: { raw: string }|string }) => {
                //const rawDate = member.paymentDate;
                const rawDate =typeof member.paymentDate === "string"
                ? member.paymentDate
                : member.paymentDate.raw; // Handle both cases
                const parsedDate = parse(rawDate, "dd/MM/yyyy", new Date()); // Correctly parse DD/MM/YYYY
                return isValid(parsedDate) ? parsedDate.getFullYear() : null; // Extract year if valid
              })
              .filter((year: number | null) => year !== null) // Remove invalid years
          ),
        ].sort((a:any, b:any) => a - b);

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

        const newMembersThisMonth = apiMembers.filter(
          (member: { paymentDate: string | number | Date }) => {
            if (!member.paymentDate) return false; // Skip if paymentDate is missing

            // const joinDate = parseDate(member.paymentDate);
            let joinDate: Date;

            // Handle different types of paymentDate
            if (typeof member.paymentDate === "string") {
              joinDate = parse(member.paymentDate, "dd/MM/yyyy", new Date()); // Parse string date
            } else if (typeof member.paymentDate === "number") {
              joinDate = new Date(member.paymentDate); // Convert number to Date
            } else {
              joinDate = member.paymentDate; // Already a Date
            }

            if (isNaN(joinDate.getTime())) {
              console.error("Invalid Date Format:", member.paymentDate);
              return false;
            }

            const currentDate = new Date();
            return (
              joinDate.getMonth() === currentDate.getMonth() &&
              joinDate.getFullYear() === currentDate.getFullYear()
            );
          }
        ).length;

        // Update state
        setAnalyticsData({
          totalMembers,
          activeMembers,
          totalRevenue,
          newMembersThisMonth,
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
              },
              data: [
                { label: "Basic", value: membershipDistribution.basic },
                { label: "Standard", value: membershipDistribution.standard },
                { label: "Premium", value: membershipDistribution.premium },
                { label: "Annual", value: membershipDistribution.annual },
              ],
            },
          },
          newMembers: {
            type: "column2d",
            width: "100%",
            height: "400",
            dataFormat: "json",
            dataSource: {
              chart: {
                caption: "New Members This Month",
                theme: "fusion",
              },
              data: [{ label: "New Members", value: newMembersThisMonth }],
            },
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(()=>{

    const addDeleteMemberStat = async()=>{
        try{
          const token = localStorage.getItem("token"); // Retrieve token from local storage
          const response = await axios.get(
            "http://localhost:3000/api/library/get-all-members",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add token to headers
              },
            }
          );
          const stats = new Array(12).fill(0);
            response.data.forEach((member :any) => {
            member.paymentHistory.forEach((payment:any) => {
              const paymentDate = new Date(payment.paymentDate);

    
              if (paymentDate.getFullYear() === deleteAddSelectedYear) {
                stats[paymentDate.getMonth()] += 1;
              }
            });
          });
          
          const newStats = stats.map((count, index) => ({ month: index + 1, count }));

          // Fetch deleted members
          const deletedMembersResponse = await axios.get(
            "http://localhost:3000/api/library/get-deleted-member",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const deletedStats = new Array(12).fill(0);
          deletedMembersResponse.data
            .filter((stat:any) => stat._id.year === deleteAddSelectedYear)
            .forEach((stat:any) => {
              deletedStats[stat._id.month - 1] = stat.count; // Use month - 1 for 0-based index
            });


          SetAddDeleteChart((prevConfigs:any) =>({
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
                    seriesname: "New/Renewd Members",
                    data: newStats.map((stat) => ({ value: stat.count })),
                  },
                  {
                    seriesname: "Deleted Members",
                    data: deletedStats.map((count) => ({ value: count })),
                  },
                ],
              },
            },
          }));


        }catch(error:any){
          console.log(error)
        }
    } 
    addDeleteMemberStat();


  },[deleteAddSelectedYear])
  
  

  useEffect(() => {
    const calculateMonthlyTrends = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const response = await axios.get(
          "http://localhost:3000/api/library/get-all-members",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to headers
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

        console.log("month", monthlyPayments);

        const monthlyData = Array.from({ length: 12 }, (_, month) => {
          const key = `${selectedYear}-${month}`;
          return {
            label: new Date(selectedYear, month, 1).toLocaleString("default", {
              month: "short",
            }),
            value: monthlyPayments[key] || 0,
          };
        });
        console.log(monthlyData);

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

  // useEffect(() => {
  //   const calculateDeleteStats = async () => {
  //     try {
  //       const token = localStorage.getItem("token"); // Retrieve token from local storage
  //       const response = await axios.get(
  //         "http://localhost:3000/api/library/get-deleted-member",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Add token to headers
  //           },
  //         }
  //       );
  //       SetDeletedMemberStat(response.data);
  //     } catch (error) {
  //       console.log("Error fecting data:", error);
  //     }
  //   };
  //   calculateDeleteStats();
  // }, [deleteAddSelectedYear]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Analytics Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold">Total Members</h3>
          <p className="text-2xl font-bold">{analyticsData.totalMembers}</p>
          <ReactFusioncharts {...chartConfigs.totalMembers} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">{analyticsData.totalRevenue}</p>
          <ReactFusioncharts {...chartConfigs.revenue} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold">Membership Distribution</h3>
          <ReactFusioncharts {...chartConfigs.membershipDistribution} />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold">Membership Distribution</h3>
          <div className="mb-4">
            <label htmlFor="yearFilter" className="mr-2 font-medium">
              Select Year:
            </label>
            <select
              id="yearFilter"
              className="border rounded px-2 py-1 w-40"
              value={deleteAddSelectedYear}
              onChange={(e) => setDeleteAddSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <ReactFusioncharts {...addDeleteChart.addDeleteTrends} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-full">
          <h3 className="text-xl font-semibold">Monthly Payment Trends</h3>
          <div className="mb-4">
            <label htmlFor="yearFilter" className="mr-2 font-medium">
              Select Year:
            </label>
            <select
              id="yearFilter"
              className="border rounded px-2 py-1 w-40"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
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