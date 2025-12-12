import React from 'react';
import { BarChart2, TrendingUp, Users, Clock, ThumbsUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AnalyticsView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics Overview</h1>
           <p className="text-sm text-gray-500">Performance metrics for the last 30 days.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none hover:border-gray-300 transition-colors cursor-pointer">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last Quarter</option>
          </select>
          <button className="bg-white border border-gray-200 text-sm font-medium rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FileDown size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Tickets', value: '1,248', change: '+12%', trend: 'up', icon: <BarChart2 size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
          { title: 'Avg Reply Time', value: '1h 42m', change: '-8%', trend: 'down', icon: <Clock size={20} className="text-orange-500" />, bg: 'bg-orange-50' },
          { title: 'CSAT Score', value: '4.8/5.0', change: '+2%', trend: 'up', icon: <ThumbsUp size={20} className="text-green-500" />, bg: 'bg-green-50' },
          { title: 'Resolution Rate', value: '94%', change: '+1%', trend: 'up', icon: <TrendingUp size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 font-medium">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart (CSS Simulated) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-800">Ticket Volume by Day</h3>
             <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div>New</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div>Resolved</span>
             </div>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-2 px-2">
             {[40, 65, 32, 50, 85, 45, 60, 75, 55, 40, 65, 80, 50, 60].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                 {/* Tooltip */}
                 <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                   {h} Tickets
                 </div>
                 <div style={{ height: `${h * 0.6}%` }} className="w-full bg-gray-200 rounded-t-sm group-hover:bg-gray-300 transition-colors"></div>
                 <div style={{ height: `${h}%` }} className="w-full bg-primary rounded-t-sm group-hover:bg-primary-hover transition-colors"></div>
               </div>
             ))}
           </div>
           <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-xs text-gray-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>

        {/* Categories Donut (CSS Simulated) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
           <h3 className="font-bold text-gray-800 mb-6">Tickets by Category</h3>
           <div className="flex-1 flex items-center justify-center relative">
             <div className="w-48 h-48 rounded-full relative" style={{ 
                background: 'conic-gradient(#006CFF 0% 35%, #FFD54F 35% 60%, #FF6F61 60% 80%, #E6F0FF 80% 100%)'
             }}>
                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                   <span className="text-3xl font-bold text-gray-900">1.2k</span>
                   <span className="text-xs text-gray-500">Total</span>
                </div>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div> Technical (35%)</div>
             <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-alert-yellow"></div> Billing (25%)</div>
             <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-alert-red"></div> Bugs (20%)</div>
             <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-sky"></div> Other (20%)</div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Helper Icon for export button not imported above to save import line length
const FileDown: React.FC<{size?: number}> = ({size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

export default AnalyticsView;
