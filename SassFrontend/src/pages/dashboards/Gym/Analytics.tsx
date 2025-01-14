import { FC } from 'react';

const Analytics: FC = () => {
  return (
    <section id="analytics" className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Revenue Overview */}
        <div className="bg-white p-6 rounded border border-neutral-200/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h2 className="text-xl font-semibold">Revenue Overview</h2>
            <select className="px-4 w-40 py-2 border border-neutral-200/30 rounded">
              <option>This Year</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="h-80 bg-neutral-50 mt-6"></div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Membership Distribution */}
          <div className="bg-white p-6 rounded border border-neutral-200/30">
            <h3 className="text-lg font-semibold mb-4">Membership Distribution</h3>
            <div className="space-y-4">
              {[
                { label: 'Premium', percentage: 45, color: 'blue' },
                { label: 'Standard', percentage: 35, color: 'green' },
                { label: 'Basic', percentage: 20, color: 'yellow' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 bg-${item.color}-500 rounded-full mr-2`}></div>
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold">{item.percentage}%</span>
                    <div className={`w-24 h-2 bg-${item.color}-500 rounded ml-2`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white p-6 rounded border border-neutral-200/30">
            <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
            <div className="h-64 bg-neutral-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;