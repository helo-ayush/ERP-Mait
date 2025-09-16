import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb,
  UploadCloud,
  Link as LinkIcon,
  Paperclip,
  AlertTriangle,
  PieChart, // Added for stats
} from 'lucide-react';
import { getEnv, apiFetch, openExternal } from '../utils/env';

const Assignment = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const { apiBaseUrl } = getEnv();

  const submitAssignment = async (assignmentId) => {
    try {
      await apiFetch(`/assignments/${assignmentId}/submit`, { method: 'POST', body: JSON.stringify({ placeholder: true }) });
      alert('Submission initiated (mock). Connect your backend to finalize.');
    } catch (e) {
      alert('Failed to submit assignment');
    }
  };

  // Mock Data for Assignments
  const assignmentsData = [
    {
      id: 1,
      title: 'Quantum Mechanics Problem Set',
      subject: 'Physics',
      description: 'Solve the first 10 problems from Chapter 3 of the textbook. Show all your work clearly.',
      dueDate: '2025-09-20T23:59:59',
      status: 'Pending',
      hint: 'Remember to consider the wave-particle duality for problem #7.',
      submission: null,
    },
    {
      id: 2,
      title: 'Essay on Post-colonial Literature',
      subject: 'English',
      description: 'Write a 1500-word essay on the impact of colonialism on modern Indian literature.',
      dueDate: '2025-09-22T23:59:59',
      status: 'Pending',
      hint: null,
      submission: null,
    },
    {
      id: 3,
      title: 'Organic Chemistry Lab Report',
      subject: 'Chemistry',
      description: 'Submit the full lab report for the experiment conducted on Sep 10th.',
      dueDate: '2025-09-14T23:59:59', // This is overdue
      status: 'Late Submission',
      hint: 'Don\'t forget to include the molecular structure diagrams.',
      submission: null,
    },
    {
      id: 4,
      title: 'Linear Algebra Assignment',
      subject: 'Mathematics',
      description: 'Complete the exercises on vector spaces and linear transformations.',
      dueDate: '2025-09-12T23:59:59',
      status: 'Submitted',
      hint: null,
      submission: { type: 'File', name: 'Linear_Algebra_HW.pdf', date: '2025-09-11T18:30:00' },
    },
  ];

  // --- STATS CALCULATION ---
  const totalAssignments = assignmentsData.length;
  const submittedCount = assignmentsData.filter(a => a.status === 'Submitted').length;
  const pendingCount = totalAssignments - submittedCount;
  const completionPercentage = Math.round((submittedCount / totalAssignments) * 100);
  
  const filteredAssignments = assignmentsData.filter(assignment => {
    if (activeTab === 'Pending') return assignment.status === 'Pending' || assignment.status === 'Late Submission';
    if (activeTab === 'Submitted') return assignment.status === 'Submitted';
    return true; // For "All" tab
  });

  const TabButton = ({ label, tabKey }) => (
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

  const AssignmentCard = ({ assignment }) => {
    const [showHint, setShowHint] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        const difference = dueDate - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
        } else {
          setTimeLeft('Deadline Passed');
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
      return () => clearInterval(timer);
    }, [assignment.dueDate]);

    const getStatusPill = (status) => {
        switch (status) {
            case 'Submitted': return <span className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" />Submitted</span>;
            case 'Late Submission': return <span className="flex items-center gap-1.5 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><AlertTriangle className="w-3.5 h-3.5" />Pending (Late)</span>;
            default: return <span className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><XCircle className="w-3.5 h-3.5" />Pending</span>;
        }
    };
    
    return (
        <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{assignment.subject}</span>
                {getStatusPill(assignment.status)}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 my-2">{assignment.title}</h3>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{assignment.description}</p>

            {assignment.hint && (
                <div className="mb-4">
                    {!showHint && <button onClick={() => setShowHint(true)} className="flex items-center gap-2 text-sm font-semibold text-purple-600"><Lightbulb className="w-4 h-4" /> Show Hint</button>}
                    {showHint && <div className="p-3 bg-purple-50/70 border-l-4 border-purple-400 text-purple-800 text-sm"><strong>Hint:</strong> {assignment.hint}</div>}
                </div>
            )}
            
            <div className="border-t border-white/50 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span className="text-sm font-bold text-red-600">{timeLeft}</span>
                </div>
                {assignment.status !== 'Submitted' ? (
                     <button onClick={() => submitAssignment(assignment.id)} className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        <UploadCloud className="w-4 h-4"/> Submit Assignment
                    </button>
                ) : (
                    <div className="p-3 bg-green-50/80 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-green-800">
                            <Paperclip className="w-4 h-4" />
                            <div>
                                <span className="font-semibold">Submitted:</span> {assignment.submission.name}
                            </div>
                        </div>
                        <button onClick={() => openExternal(`${apiBaseUrl}/assignments/${assignment.id}`)} className="text-xs font-semibold text-green-800 hover:underline">View/Resubmit</button>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide">
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      {/* Header */}
      <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">My Assignments</h1>
        <p className="text-gray-700 font-medium text-sm md:text-base">Track, manage, and submit your coursework on time.</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-3 flex items-center gap-2">
        <div className="flex items-center gap-2 p-1 bg-gray-200/50 rounded-lg">
            <TabButton label="Pending" tabKey="Pending" />
            <TabButton label="Submitted" tabKey="Submitted" />
            <TabButton label="All" tabKey="All" />
        </div>
      </div>

      {/* --- NEW STATS SECTION --- */}
      <div className="mb-6 backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-500" />
            Progress Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress Bar */}
            <div className="md:col-span-1 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                    <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">{submittedCount} of {totalAssignments} assignments completed</p>
            </div>
            {/* Submitted Stats */}
            <div className="p-4 bg-white/50 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800">{submittedCount}</p>
                    <p className="text-sm text-gray-600">Submitted</p>
                </div>
            </div>
             {/* Pending Stats */}
            <div className="p-4 bg-white/50 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                    <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                </div>
            </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredAssignments.length > 0 ? (
            filteredAssignments.map(assignment => <AssignmentCard key={assignment.id} assignment={assignment} />)
        ) : (
            <div className="lg:col-span-3 backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-10 text-center">
                <h3 className="text-xl font-semibold text-gray-800">No assignments here!</h3>
                <p className="text-gray-600">You're all caught up in this category.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Assignment;