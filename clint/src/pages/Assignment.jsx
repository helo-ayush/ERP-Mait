import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Upload,
  Clock,
  Calendar,
  BookOpen,
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  History,
  Download,
  User,
  Settings
} from 'lucide-react';

const Assignment = () => {
  const [userRole, setUserRole] = useState('student'); // 'admin' or 'student'
  const [showHints, setShowHints] = useState({});
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Database Management System Project",
      subject: "Computer Science",
      description: "Design and implement a complete database system for a library management application with proper normalization and indexing.",
      deadline: "2025-09-25T23:59:00",
      type: "Project",
      status: "pending", // pending, submitted, late
      hint: "Consider using ER diagrams first, then convert to relational schema. Focus on 3NF normalization.",
      submissionLink: "",
      hasHint: true,
      submissionCount: 0
    },
    {
      id: 2,
      title: "Machine Learning Algorithm Analysis",
      subject: "Artificial Intelligence",
      description: "Compare and analyze different supervised learning algorithms on the provided dataset.",
      deadline: "2025-09-20T18:00:00",
      type: "Theory",
      status: "submitted",
      hint: "Start with simple algorithms like Linear Regression and Decision Trees before moving to complex ones.",
      submissionLink: "https://drive.google.com/file/d/example",
      hasHint: true,
      submissionCount: 2
    },
    {
      id: 3,
      title: "Web Development Portfolio",
      subject: "Web Technologies",
      description: "Create a responsive portfolio website showcasing your projects using HTML, CSS, and JavaScript.",
      deadline: "2025-09-30T23:59:00",
      type: "Practical",
      status: "pending",
      hint: "Use CSS Grid and Flexbox for responsive layouts. Consider mobile-first approach.",
      submissionLink: "",
      hasHint: true,
      submissionCount: 0
    },
    {
      id: 4,
      title: "Network Security Report",
      subject: "Cybersecurity",
      description: "Analyze common network vulnerabilities and propose security measures for enterprise networks.",
      deadline: "2025-09-18T15:30:00",
      type: "Theory",
      status: "late",
      hint: "",
      submissionLink: "",
      hasHint: false,
      submissionCount: 1
    }
  ]);

  const toggleHint = (assignmentId) => {
    setShowHints(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'text-green-600 bg-green-50';
      case 'late': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="w-4 h-4" />;
      case 'late': return <AlertTriangle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const AssignmentCard = ({ assignment }) => {
    const timeRemaining = getTimeRemaining(assignment.deadline);
    const isOverdue = timeRemaining === "Overdue";

    return (
      <div className="backdrop-blur-sm bg-white/70 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:scale-[1.02]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{assignment.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>{assignment.subject}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {assignment.type}
              </span>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
            {getStatusIcon(assignment.status)}
            <span className="capitalize">{assignment.status}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          {assignment.description}
        </p>

        <div className="flex items-center space-x-2 mb-4 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            Due: {new Date(assignment.deadline).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <Clock className="w-4 h-4 text-gray-500" />
          <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
            {timeRemaining}
          </span>
        </div>

        {assignment.hasHint && (
          <div className="mb-4">
            <button
              onClick={() => toggleHint(assignment.id)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showHints[assignment.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showHints[assignment.id] ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
            {showHints[assignment.id] && assignment.hint && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <strong>Hint:</strong> {assignment.hint}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {assignment.status === 'pending' ? (
            <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-medium shadow-md">
              <Upload className="w-4 h-4" />
              <span>Submit Assignment</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Submitted</span>
              {assignment.submissionLink && (
                <a href={assignment.submissionLink} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {assignment.submissionCount > 0 && (
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm">
              <History className="w-4 h-4" />
              <span>History ({assignment.submissionCount})</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Assignment Management!</h1>
        <p className="text-gray-700 font-medium text-sm md:text-base">View and submit your assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map(assignment => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </div>
  );
};

export default Assignment;
