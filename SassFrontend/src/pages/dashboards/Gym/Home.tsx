import { FC } from 'react';

const Home: FC = () => {
  const stats = [
    {
      title: "Total Members",
      value: "2,543",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: "bg-blue-100"
    },
    {
      title: "Monthly Revenue",
      value: "$45,250",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-green-100"
    },
    // ... other stats
  ];

  return (
    <section id="home" className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded border border-neutral-200/30">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-semibold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded border border-neutral-200/30">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
          <div className="h-64 bg-neutral-50"></div>
        </div>
        <div className="bg-white p-6 rounded border border-neutral-200/30">
          <h3 className="text-lg font-semibold mb-4">Member Activity</h3>
          <div className="h-64 bg-neutral-50"></div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white p-6 rounded border border-neutral-200/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <a href="#" className="text-blue-600 hover:text-blue-700">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Member</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Activity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {/* Add your table rows here */}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Home;