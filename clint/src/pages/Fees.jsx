import React, { useState } from 'react';
import {
  DollarSign,
  FileText,
  Download,
  Filter,
  CreditCard,
  Banknote,
  Receipt,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Printer,
  ChevronDown,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { getEnv, openExternal, apiFetch } from '../utils/env';

const Fees = () => {
  const [activeTab, setActiveTab] = useState('ug');
  const { paymentUrl, apiBaseUrl } = getEnv();

  const handlePayNow = () => {
    if (paymentUrl) {
      openExternal(paymentUrl);
    } else {
      alert('Payment URL is not configured. Set VITE_PAYMENT_URL in your .env');
    }
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      const blobUrl = `${apiBaseUrl}/fees/receipt/${paymentId}`;
      openExternal(blobUrl);
    } catch (e) {
      alert('Failed to download receipt');
    }
  };

  const handlePrintStructure = () => {
    window.print();
  };

  // Mock Data
  const feeStructures = {
    ug: [
      { id: 1, course: 'B.Tech - Computer Science', tuition: 75000, additional: 15000, total: 90000, department: 'Engineering' },
      { id: 2, course: 'B.Com - Honors', tuition: 40000, additional: 5000, total: 45000, department: 'Commerce' },
      { id: 3, course: 'B.Sc - Physics', tuition: 45000, additional: 12000, total: 57000, department: 'Science' },
    ],
    pg: [
      { id: 1, course: 'M.Tech - AI & ML', tuition: 95000, additional: 20000, total: 115000, department: 'Engineering' },
      { id: 2, course: 'MBA - Marketing', tuition: 120000, additional: 18000, total: 138000, department: 'Management' },
    ],
    diploma: [
      { id: 1, course: 'Diploma in Web Development', tuition: 30000, additional: 5000, total: 35000, department: 'Vocational' },
    ],
  };

  const paymentHistory = [
    { id: 'TXN741852', date: '2025-08-20', amount: 90000, status: 'Completed', semester: 'Fall 2025' },
    { id: 'TXN635241', date: '2025-02-15', amount: 88000, status: 'Completed', semester: 'Spring 2025' },
    { id: 'TXN589632', date: '2024-08-18', amount: 88000, status: 'Completed', semester: 'Fall 2024' },
  ];
  
  const refundStatus = {
    active: true,
    status: 'Processing', // Initiated -> Processing -> Completed
    stages: ['Initiated', 'Processing', 'Completed'],
  };

  const TabButton = ({ label, tabKey, activeTab, setActiveTab }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
        activeTab === tabKey
          ? 'bg-blue-500 text-white shadow'
          : 'text-gray-600 hover:bg-white/60'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Fee Management</h1>
          <p className="text-gray-700 font-medium text-sm md:text-base">View fee structures, make payments, and track your history.</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program-wise Fee Structure Card */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-3 md:mb-0">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Fee Structure
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrintStructure} className="p-2 bg-white/50 hover:bg-white/80 rounded-lg text-gray-600 transition-colors">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={() => openExternal(`${apiBaseUrl}/fees/structure?program=${activeTab}`)} className="p-2 bg-white/50 hover:bg-white/80 rounded-lg text-gray-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Tabs and Filters */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div className="flex items-center gap-2 p-1 bg-gray-200/50 rounded-lg">
                  <TabButton label="UG" tabKey="ug" activeTab={activeTab} setActiveTab={setActiveTab} />
                  <TabButton label="PG" tabKey="pg" activeTab={activeTab} setActiveTab={setActiveTab} />
                  <TabButton label="Diploma" tabKey="diploma" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80">
                    <option>All Departments</option>
                    <option>Engineering</option>
                    <option>Commerce</option>
                  </select>
                  <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80">
                    <option>Batch 2025</option>
                    <option>Batch 2024</option>
                  </select>
                </div>
              </div>

              {/* Fee Table */}
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-white/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 rounded-l-lg">Course Name</th>
                      <th scope="col" className="px-6 py-3">Tuition Fee</th>  
                      <th scope="col" className="px-6 py-3">Additional Charges</th>
                      <th scope="col" className="px-6 py-3 rounded-r-lg">Total Fee (per sem)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeStructures[activeTab].map(item => (
                      <tr key={item.id} className="hover:bg-white/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{item.course}</td>
                        <td className="px-6 py-4 text-gray-600">₹{item.tuition.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-gray-600">₹{item.additional.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">₹{item.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History Card */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Receipt className="w-5 h-5 text-purple-500" />
                Payment History
              </h2>
              <div className="space-y-3 overflow-y-auto h-60 scrollbar-hide">
                {paymentHistory.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white/70">
                    <div>
                      <p className="font-medium text-gray-800">{payment.semester} - Fee Payment</p>
                      <p className="text-xs text-gray-500">ID: {payment.id} on {payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{payment.amount.toLocaleString('en-IN')}</p>
                       <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Completed</span>
                    </div>
                    <button onClick={() => handleDownloadReceipt(payment.id)} className="p-2 bg-white hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
             {/* My Fee Summary Card */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    My Fee Summary
                </h2>
                <div className="space-y-4">
                    <div className="p-4 bg-white/50 rounded-lg text-center">
                        <p className="text-xs text-gray-600">Outstanding Dues</p>
                        <p className="text-3xl font-bold text-red-500">₹0</p>
                        <p className="text-xs text-green-600 font-medium mt-1">All dues cleared!</p>
                    </div>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Semester Fee:</span>
                            <span className="font-medium text-gray-800">₹{Number(90000).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Amount Paid:</span>
                            <span className="font-medium text-gray-800">₹{Number(90000).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-blue-600">
                            <span className="text-gray-600">Next Due Date:</span>
                            <span className="font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Feb 15, 2026</span>
                        </div>
                    </div>
                    <button onClick={handlePayNow} className="w-full mt-2 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        Pay Now <ArrowRight className="w-4 h-4"/>
                    </button>
                    <p className="text-xs text-center text-gray-500">Supports Cards, Net Banking & UPI</p>
                </div>
            </div>

            {/* Payment Guidelines Card */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                Guidelines & Policy
              </h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Late fee of <span className="font-semibold">₹100/day</span> will be applied after the due date.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Installment options are available. Contact the finance office for more details.</span>
                </li>
                 <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Registration, Exam, and Lab fees are non-refundable.</span>
                </li>
              </ul>
            </div>

            {/* Refund & Withdrawal Card */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <RefreshCw className="w-5 h-5 text-red-500" />
                Refund Status
              </h2>
              {refundStatus.active ? (
                <div>
                  <div className="relative mb-6">
                    <div className="h-1 bg-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                    <div className="absolute flex justify-between w-full -top-2.5">
                      {refundStatus.stages.map((stage, index) => (
                        <div key={stage} className={`w-6 h-6 rounded-full flex items-center justify-center ${index < 2 ? 'bg-blue-500 border-2 border-white' : 'bg-gray-200'}`}>
                        {index < 2 && <CheckCircle className="w-3 h-3 text-white"/>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-600 mt-2">
                    {refundStatus.stages.map(stage => <span key={stage}>{stage}</span>)}
                  </div>
                  <p className="text-center text-sm font-medium text-gray-800 mt-6">Your refund request is currently <span className="text-blue-600">{refundStatus.status}</span>.</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">No active refund requests. Please refer to the policy before initiating a request.</p>
                  <button className="px-4 py-2 bg-white/60 hover:bg-white/90 text-sm font-semibold text-gray-800 rounded-lg transition-colors">
                    Request Refund
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fees;