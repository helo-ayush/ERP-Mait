import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch, getEnv } from '../utils/env';
import {
  Users,
  UserCheck,
  UserX,
  Bell,
  Search,
  Eye,
  MoreVertical,
  BookOpen,
  Calendar,
  DollarSign,
  Home,
  GraduationCap,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Building,
  FileText,
  Mail,
  LayoutGrid,
  Check,
  X,
  ArrowRight,
  UserPlus,
  Edit
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const read = (k, f) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [classes, setClasses] = useState(() => read('classes', []));
  const currentCollegeId = useMemo(() => read('currentCollegeId', null), []);
  const colleges = useMemo(() => read('colleges', []), []);
  const collegeProfile = useMemo(() => colleges.find(c => (c.id || c.collegeId) === currentCollegeId) || null, [colleges, currentCollegeId]);

  useEffect(() => {
    const load = async () => {
      try {
        const collegeId = currentCollegeId;
        const [p, a] = await Promise.all([
          apiFetch(`/admin/pending-teachers?collegeId=${encodeURIComponent(collegeId || '')}`),
          apiFetch(`/admin/approved-teachers?collegeId=${encodeURIComponent(collegeId || '')}`)
        ]);
        const toPendingShape = (u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone || '—',
          department: u.department || '—',
          qualification: u.qualification || '—',
          requestDate: new Date(u.createdAt).toISOString().slice(0,10),
          avatarInitial: (u.name || 'T').charAt(0).toUpperCase(),
          documents: ['Resume'],
        });
        const toApprovedShape = (u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          department: u.department || '—',
          status: 'Active',
          joinDate: new Date(u.createdAt).toISOString().slice(0,10),
          classes: 0,
          students: 0,
          avatarInitial: (u.name || 'T').charAt(0).toUpperCase(),
        });
        setPendingTeachers((p.users || []).map(toPendingShape));
        setApprovedTeachers((a.users || []).map(toApprovedShape));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => ({
    totalStudents: classes.reduce((acc, c) => acc + (c.students?.length || 0), 0),
    totalTeachers: approvedTeachers.length,
    totalClasses: classes.length,
    pendingRequests: pendingTeachers.length,
  }), [classes, approvedTeachers, pendingTeachers]);

  const allClasses = useMemo(() => classes.map(c => ({
    id: c.classId,
    name: c.name,
    teacher: c.teacherName || c.teacherEmail,
    students: c.students?.length || 0,
    department: c.department || '—'
  })), [classes]);

  const handleApproveTeacher = async (teacherId) => {
    try {
      const t = pendingTeachers.find(x => x.id === teacherId);
      if (!t) return;
      await apiFetch('/auth/approve-teacher', { method: 'POST', body: JSON.stringify({ email: t.email }) });
      setPendingTeachers(pendingTeachers.filter(x => x.id !== teacherId));
      setApprovedTeachers([...approvedTeachers, { ...t, status: 'Active', joinDate: new Date().toISOString().slice(0,10), classes: 0, students: 0 }]);
    } catch (e) {
      alert('Failed to approve');
    }
  };

  const handleRejectTeacher = (teacherId) => {
    const updatedPending = pendingTeachers.filter(x => x.id !== teacherId);
    setPendingTeachers(updatedPending);
    write('teachersPending', updatedPending);
  };

  const StatCard = ({ icon: Icon, value, label, color }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600'
    };

    return (
      <div className="backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-6 hover:bg-white/50 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1 font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Admin Management Portal
        </h1>
        <p className="text-gray-700 font-medium text-sm md:text-base">
          Welcome back, Admin. Here's a comprehensive overview of your campus.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard icon={Users} value={stats.totalStudents} label="Total Students" color="blue" />
        <StatCard icon={UserCheck} value={stats.totalTeachers} label="Total Teachers" color="purple" />
        <StatCard icon={LayoutGrid} value={stats.totalClasses} label="Active Classes" color="green" />
        <StatCard icon={UserPlus} value={stats.pendingRequests} label="Pending Requests" color="orange" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column: Management Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Teacher Requests */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-orange-500" />
              Teacher Joining Requests
            </h2>
            <div className="space-y-3">
              {pendingTeachers.map(req => (
                <div key={req.id} className="p-4 bg-white/50 rounded-lg border border-white/30 flex items-center justify-between transition-colors hover:bg-white/70">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {req.avatarInitial}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{req.name}</p>
                      <p className="text-sm text-gray-600">{req.department} • Applied {req.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejectTeacher(req.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApproveTeacher(req.id)}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-full text-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Directory */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-green-500" />
              Class Directory
            </h2>
            <div className="flex items-center gap-2 mb-4 p-2 bg-white/40 rounded-lg">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <input type="text" placeholder="Search for a class by name or teacher..." className="w-full bg-transparent focus:outline-none text-sm text-gray-700" />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide pr-2">
              {allClasses.map(cls => (
                <div key={cls.id} className="p-3 bg-white/50 rounded-lg flex items-center justify-between hover:bg-white/70 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">{cls.name}</p>
                    <p className="text-xs text-gray-600">Teacher: {cls.teacher} • Students: {cls.students}</p>
                  </div>
                  <button className="p-2 bg-white hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* User Directory */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              User Directory
            </h2>
            <div className="flex items-center gap-2 mb-4 p-2 bg-white/40 rounded-lg">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <input type="text" placeholder="Search for students or teachers by name or ID..." className="w-full bg-transparent focus:outline-none text-sm text-gray-700" />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide pr-2">
              {[...approvedTeachers].map(user => (
                <div key={user.id} className="p-3 bg-white/50 rounded-lg flex items-center justify-between hover:bg-white/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-purple-200 text-purple-700`}>
                      {user.avatarInitial}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-600">Teacher • {user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const teacher = approvedTeachers.find(t => t.email === user.email);
                      if (teacher) setSelectedTeacher(teacher);
                    }}
                    className="p-2 bg-white hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: College Profile */}
        <div className="lg:col-span-1">
          {collegeProfile ? (
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-indigo-500" />
                College Profile
              </h2>
              <div className="space-y-4">
                <div className="text-center pb-4 border-b border-white/30">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800">{collegeProfile?.name || '—'}</h3>
                  <p className="text-sm text-gray-600">ID: {collegeProfile?.collegeId || '—'}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-700">Address</p>
                      <p className="text-gray-600">{collegeProfile?.address || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-gray-600">{collegeProfile?.email || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-700">Phone</p>
                      <p className="text-gray-600">{collegeProfile?.phone || '—'}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <Building className="w-5 h-5 text-indigo-500" />
                College Profile
              </h2>
              <p className="text-gray-700 text-sm">No college profile found. Please add your college details.</p>
              <button className="w-full mt-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" />
                Add Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPendingTeachers = () => (
    <div className="p-4 md:p-6">
      <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl">
        <div className="p-6 border-b border-white/30">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center">
            <UserCheck className="h-7 w-7 mr-3 text-orange-500" />
            Pending Teacher Applications ({pendingTeachers.length})
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {pendingTeachers.map((teacher) => (
              <div key={teacher.id} className="backdrop-blur-sm bg-white/50 border border-white/30 rounded-xl p-6 hover:bg-white/60 transition-all duration-300 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mr-4">
                        {teacher.avatarInitial}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">Pending Review</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-600">{teacher.email}</span></p>
                        <p><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-600">{teacher.phone}</span></p>
                      </div>
                      <div className="space-y-2">
                        <p><span className="font-semibold text-gray-700">Department:</span> <span className="text-gray-600">{teacher.department}</span></p>
                        <p><span className="font-semibold text-gray-700">Experience:</span> <span className="text-gray-600">{teacher.experience}</span></p>
                      </div>
                      <div className="space-y-2">
                        <p><span className="font-semibold text-gray-700">Qualification:</span> <span className="text-gray-600">{teacher.qualification}</span></p>
                        <p><span className="font-semibold text-gray-700">Applied:</span> <span className="text-gray-600">{teacher.requestDate}</span></p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50/50 rounded-lg">
                      <p className="text-sm"><span className="font-semibold text-gray-700">Documents Submitted:</span> <span className="text-gray-600">{teacher.documents.join(', ')}</span></p>
                    </div>
                  </div>
                  <div className="ml-6 flex flex-col space-y-3">
                    <button
                      onClick={() => handleApproveTeacher(teacher.id)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center shadow-lg"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectTeacher(teacher.id)}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center shadow-lg"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="p-4 md:p-6">
      <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl">
        <div className="p-6 border-b border-white/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <Users className="h-7 w-7 mr-3 text-blue-500" />
              Available Teachers ({approvedTeachers.length})
            </h2>
            <div className="flex items-center gap-2 p-2 bg-white/40 rounded-lg">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search teachers..."
                className="bg-transparent focus:outline-none text-sm text-gray-700"
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6">
            {approvedTeachers.map((teacher) => (
              <div key={teacher.id} className="backdrop-blur-sm bg-white/50 border border-white/30 rounded-xl p-6 hover:bg-white/60 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mr-4">
                        {teacher.avatarInitial}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">{teacher.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <p><span className="font-semibold text-gray-700">Department:</span></p>
                        <p className="text-gray-600">{teacher.department || '—'}</p>
                        <p><span className="font-semibold text-gray-700">Email:</span></p>
                        <p className="text-gray-600">{teacher.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p><span className="font-semibold text-gray-700">Classes:</span></p>
                        <p className="text-gray-600">{teacher.classes}</p>
                        <p><span className="font-semibold text-gray-700">Students:</span></p>
                        <p className="text-gray-600">{teacher.students}</p>
                      </div>
                      <div className="space-y-1">
                        <p><span className="font-semibold text-gray-700">Joined:</span></p>
                        <p className="text-gray-600">{teacher.joinDate}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => setSelectedTeacher(teacher)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeacherProfile = (teacher) => (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <button
          onClick={() => setSelectedTeacher(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Teachers
        </button>
      </div>

      {/* Teacher Header */}
      <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg mr-6">
              {teacher.avatarInitial}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{teacher.name}</h2>
              <p className="text-gray-600 text-lg">{teacher.department}</p>
              <p className="text-sm text-gray-500">{teacher.email}</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">{teacher.status}</span>
        </div>

        {/* Teacher Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50/50 rounded-xl">
            <BookOpen className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{teacher.classes}</p>
            <p className="text-sm text-gray-600">Total Classes</p>
          </div>
          <div className="text-center p-6 bg-green-50/50 rounded-xl">
            <GraduationCap className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{teacher.students}</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div className="text-center p-6 bg-purple-50/50 rounded-xl">
            <Calendar className="h-10 w-10 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{teacher.joinDate}</p>
            <p className="text-sm text-gray-600">Joined</p>
          </div>
        </div>
      </div>

      {/* Teacher Classes */}
      <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-indigo-500" />
          Classes by {teacher.name}
        </h3>
        <div className="space-y-3">
          {allClasses.filter(c => c.teacher === teacher.name).map(cls => (
            <div key={cls.id} className="p-4 bg-white/50 rounded-lg border flex items-center justify-between hover:bg-white/70">
              <div>
                <p className="font-semibold">{cls.name}</p>
                <p className="text-sm text-gray-600">{cls.department} • Students: {cls.students}</p>
              </div>
              <button
                onClick={() => setSelectedStudent({ class: cls, students })}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" /> Inspect Students
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentList = (clsData) => (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <button
          onClick={() => setSelectedStudent(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to {clsData.class.name}
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">{clsData.class.name} - Student List</h2>
      <div className="space-y-4">
        {clsData.students.map(stu => (
          <div key={stu.id} className="p-4 bg-white/50 rounded-lg border hover:bg-white/70">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{stu.name} ({stu.rollNo})</p>
                <p className="text-sm text-gray-600">Attendance: {stu.attendance}%</p>
              </div>
              <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (optional, if you want navigation) */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 font-bold text-xl">Admin Panel</div>
        <ul className="space-y-2 p-4">
          <li>
            <button
              onClick={() => { setActiveTab('overview'); setSelectedTeacher(null); }}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === 'overview' ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => { setActiveTab('pendingTeachers'); setSelectedTeacher(null); }}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === 'pendingTeachers' ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              Pending Teachers
            </button>
          </li>
          <li>
            <button
              onClick={() => { setActiveTab('teachers'); setSelectedTeacher(null); }}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === 'teachers' ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              Teachers
            </button>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'pendingTeachers' && renderPendingTeachers()}
        {activeTab === 'teachers' && !selectedTeacher && renderTeachers()}
        {selectedTeacher && renderTeacherProfile(selectedTeacher)}
      </div>
    </div>
  );
}


export default AdminDashboard;