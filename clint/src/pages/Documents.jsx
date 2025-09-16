import React from 'react';
import {
  FileCheck2,
  UploadCloud,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { getEnv, openExternal } from '../utils/env';

const Documents = () => {
  const { apiBaseUrl } = getEnv();
  // Mock Data for the document list
  const requiredDocuments = [
    {
      id: 1,
      name: 'Class 10 Marksheet',
      status: 'Approved',
      submittedOn: '2025-08-10',
      verifiedOn: '2025-08-12',
      fileUrl: '#',
      rejectionReason: null,
    },
    {
      id: 2,
      name: 'Class 12 Marksheet',
      status: 'Approved',
      submittedOn: '2025-08-10',
      verifiedOn: '2025-08-12',
      fileUrl: '#',
      rejectionReason: null,
    },
    {
      id: 3,
      name: 'Aadhar Card (Identity Proof)',
      status: 'Pending',
      submittedOn: '2025-09-14',
      verifiedOn: null,
      fileUrl: '#',
      rejectionReason: null,
    },
    {
      id: 4,
      name: 'Transfer Certificate (TC)',
      status: 'Rejected',
      submittedOn: '2025-09-12',
      verifiedOn: '2025-09-14',
      fileUrl: '#',
      rejectionReason: 'Document is not clearly visible. Please upload a high-resolution scan.',
    },
    {
      id: 5,
      name: 'Migration Certificate',
      status: 'Not Submitted',
      submittedOn: null,
      verifiedOn: null,
      fileUrl: null,
      rejectionReason: null,
    },
  ];

  const getStatusPill = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock className="w-3.5 h-3.5" /> Pending Verification
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            Not Submitted
          </span>
        );
    }
  };

  const ActionButtons = ({ doc }) => {
    switch (doc.status) {
      case 'Approved':
      case 'Pending':
        return (
          <button onClick={() => openExternal(`${apiBaseUrl}/documents/${doc.id}`)} className="p-2 bg-white/60 hover:bg-white/90 text-sm font-semibold text-gray-800 rounded-lg transition-colors flex items-center gap-2">
            <Eye className="w-4 h-4" /> View
          </button>
        );
      case 'Rejected':
        return (
          <div className="flex items-center gap-2">
             <button onClick={() => openExternal(`${apiBaseUrl}/documents/${doc.id}`)} className="p-2 bg-white/60 hover:bg-white/90 text-sm font-semibold text-gray-800 rounded-lg transition-colors flex items-center gap-2">
                <Eye className="w-4 h-4" /> View
            </button>
            <button onClick={() => openExternal(`${apiBaseUrl}/documents/${doc.id}/reupload`)} className="p-2 bg-blue-500 hover:bg-blue-600 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Re-upload
            </button>
          </div>
        );
      default: // Not Submitted
        return (
          <button onClick={() => openExternal(`${apiBaseUrl}/documents/upload`)} className="p-2 bg-blue-500 hover:bg-blue-600 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Upload
          </button>
        );
    }
  };

  const totalDocs = requiredDocuments.length;
  const approvedDocs = requiredDocuments.filter(d => d.status === 'Approved').length;
  const progress = (approvedDocs / totalDocs) * 100;

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide">
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      {/* Header */}
      <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Document Hub</h1>
        <p className="text-gray-700 font-medium text-sm md:text-base">Submit and track your required documents for verification.</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Left Column: Document List */}
        <div className="lg:col-span-2 backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            Required Documents
          </h2>
          <div className="space-y-3">
            {requiredDocuments.map(doc => (
              <div key={doc.id} className="p-3 bg-white/50 rounded-lg border border-white/30 transition-colors hover:bg-white/70">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800">{doc.name}</p>
                        <div className="text-xs text-gray-500 mt-1">
                            {doc.status === "Approved" && `Verified on: ${doc.verifiedOn}`}
                            {doc.status === "Pending" && `Submitted on: ${doc.submittedOn}`}
                            {doc.status === "Rejected" && `Reviewed on: ${doc.verifiedOn}`}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {getStatusPill(doc.status)}
                        <ActionButtons doc={doc} />
                    </div>
                </div>
                {doc.status === 'Rejected' && (
                    <div className="mt-2 p-2 bg-red-50/70 border-l-4 border-red-400 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                        <div><span className="font-semibold">Reason:</span> {doc.rejectionReason}</div>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Status Summary */}
        <div className="lg:col-span-1">
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Verification Status</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                            <span className="text-sm font-bold text-blue-600">{approvedDocs}/{totalDocs} Approved</span>
                        </div>
                        <div className="w-full bg-white/50 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="p-4 bg-white/50 rounded-lg border border-white/30">
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Approved</span>
                                <span className="font-semibold text-green-600">{requiredDocuments.filter(d => d.status === 'Approved').length}</span>
                            </li>
                             <li className="flex justify-between">
                                <span className="text-gray-600">Pending</span>
                                <span className="font-semibold text-yellow-600">{requiredDocuments.filter(d => d.status === 'Pending').length}</span>
                            </li>
                             <li className="flex justify-between">
                                <span className="text-gray-600">Rejected</span>
                                <span className="font-semibold text-red-600">{requiredDocuments.filter(d => d.status === 'Rejected').length}</span>
                            </li>
                             <li className="flex justify-between">
                                <span className="text-gray-600">To be Submitted</span>
                                <span className="font-semibold text-gray-500">{requiredDocuments.filter(d => d.status === 'Not Submitted').length}</span>
                            </li>
                       </ul>
                    </div>
                     <div className="text-xs text-center text-gray-500 pt-2">
                        <p>Please allow 3-5 business days for document verification after submission.</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Documents;