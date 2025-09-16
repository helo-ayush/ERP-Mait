import React from 'react';
import {
  BookCheck,
  IndianRupee,
  Library,
  Home,
  Download,
  ArrowRight,
  Filter,
  PieChart,
} from 'lucide-react';
import { getEnv, openExternal } from '../utils/env';

const Reports = () => {
  const { reportsBaseUrl } = getEnv();
  // Mock data for report summaries
  const studentReports = [
    {
      title: 'Attendance Report',
      icon: PieChart,
      color: 'blue',
      summary: {
        'Overall': '88%',
        'Present Days': 105,
        'Absent Days': 15,
      },
    },
    {
      title: 'Assignment Submissions',
      icon: BookCheck,
      color: 'purple',
      summary: {
        'Assigned': 28,
        'Submitted': 25,
        'Pending': 3,
      },
    },
    {
      title: 'Fee Payment History',
      icon: IndianRupee,
      color: 'emerald',
      summary: {
        'Total Paid': '₹3,56,000',
        'Last Payment': '₹90,000',
        'Outstanding': '₹0',
      },
    },
    {
      title: 'Library Activity',
      icon: Library,
      color: 'orange',
      summary: {
        'Books Issued': 12,
        'Fines Paid': '₹50',
        'Returned Late': 1,
      },
    },
    {
      title: 'Hostel Report',
      icon: Home,
      color: 'red',
      summary: {
        'Current Room': 'B-301',
        'Open Tickets': 1,
        'History': 'View',
      },
    },
  ];

  const ReportCard = ({ report }) => (
    <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <report.icon className={`w-8 h-8 text-${report.color}-500`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{report.title}</h3>
        <div className="grid grid-cols-3 gap-2 text-center border-t border-white/50 pt-3">
          {Object.entries(report.summary).map(([key, value]) => (
            <div key={key}>
              <p className={`text-lg font-bold text-${report.color}-600`}>{value}</p>
              <p className="text-xs text-gray-600">{key}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-6">
        <button onClick={() => openExternal(`${reportsBaseUrl}/export?report=${encodeURIComponent(report.title)}`)} className="flex-1 px-4 py-2 bg-white/60 hover:bg-white/90 text-sm font-semibold text-gray-800 rounded-lg transition-colors flex items-center justify-center gap-1">
          <Download className="w-4 h-4" />
          Export
        </button>
        <button onClick={() => openExternal(`${reportsBaseUrl}/view?report=${encodeURIComponent(report.title)}`)} className={`flex-1 px-4 py-2 bg-${report.color}-500 hover:bg-${report.color}-600 text-sm font-semibold text-white rounded-lg transition-colors flex items-center justify-center gap-1`}>
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide">
      <style>{`
        /* Tailwind JIT does not always pick up dynamic classes, define them here for safety */
        .text-blue-500{} .text-blue-600{} .bg-blue-500{} .hover:bg-blue-600{}
        .text-purple-500{} .text-purple-600{} .bg-purple-500{} .hover:bg-purple-600{}
        .text-emerald-500{} .text-emerald-600{} .bg-emerald-500{} .hover:bg-emerald-600{}
        .text-orange-500{} .text-orange-600{} .bg-orange-500{} .hover:bg-orange-600{}
        .text-red-500{} .text-red-600{} .bg-red-500{} .hover:bg-red-600{}
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* Header */}
      <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Reports & Analytics</h1>
        <p className="text-gray-700 font-medium text-sm md:text-base">View and export your academic and administrative data.</p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-5 h-5"/>
            <span>Filter by Date Range:</span>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <input type="date" defaultValue="2025-01-01" className="flex-1 px-3 py-2 text-gray-600 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80" />
            <span className="text-gray-500">-</span>
            <input type="date" defaultValue="2025-09-15" className="flex-1 px-3 py-2 text-gray-600 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80" />
        </div>
        <button className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">Apply</button>
      </div>

      {/* Student Reports Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {studentReports.map(report => <ReportCard key={report.title} report={report} />)}
        </div>
      </div>
    </div>
  );
};

export default Reports;