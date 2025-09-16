import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, getEnv } from '../utils/env';

const getStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const ensureArrays = () => {
  const defaults = {
    colleges: [],
    teachersPending: [],
    teachersApproved: [],
    classes: [],
    currentRole: null,
    currentTeacherEmail: null,
    currentCollegeId: null
  };
  Object.entries(defaults).forEach(([k, v]) => {
    const existing = getStorage(k, undefined);
    if (existing === undefined) setStorage(k, v);
  });
};

const Home = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [mode, setMode] = useState('login');
  const { apiBaseUrl } = getEnv();

  // Admin form
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    collegeId: ''
  });

  // Teacher form
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    collegeId: '',
    password: ''
  });

  // Student form
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    collegeId: '',
    password: ''
  });

  // Student quick join (optional minimal)
  const [studentJoinId, setStudentJoinId] = useState('');

  useEffect(() => {
    ensureArrays();
  }, []);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        const res = await apiFetch('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            role: 'admin',
            name: collegeForm.name,
            email: collegeForm.email,
            phone: collegeForm.phone,
            password: collegeForm.password || 'admin@123',
            collegeId: collegeForm.collegeId,
            college: {
              id: collegeForm.collegeId,
              name: collegeForm.name,
              email: collegeForm.email,
              phone: collegeForm.phone,
              address: collegeForm.address,
            },
          }),
        });
        localStorage.setItem('auth_token', res.token);
        setStorage('currentRole', 'admin');
        setStorage('currentCollegeId', collegeForm.collegeId);
        navigate('/admin');
      } else {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: collegeForm.email, password: collegeForm.password })
        });
        localStorage.setItem('auth_token', res.token);
        setStorage('currentRole', 'admin');
        setStorage('currentCollegeId', collegeForm.collegeId);
        navigate('/admin');
      }
    } catch (err) {
      alert((err && err.message) || 'Auth failed');
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        const res = await apiFetch('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            role: 'teacher',
            name: teacherForm.name,
            email: teacherForm.email,
            phone: teacherForm.phone,
            department: teacherForm.department,
            qualification: teacherForm.qualification,
            collegeId: teacherForm.collegeId,
            password: teacherForm.password,
          }),
        });
        localStorage.setItem('auth_token', res.token);
        setStorage('currentRole', 'teacher');
        setStorage('currentTeacherEmail', teacherForm.email);
        alert('Registered. Await admin approval.');
        navigate('/teachers');
      } else {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: teacherForm.email, password: teacherForm.password })
        });
        localStorage.setItem('auth_token', res.token);
        setStorage('currentRole', 'teacher');
        setStorage('currentTeacherEmail', teacherForm.email);
        navigate('/teachers');
      }
    } catch (err) {
      alert((err && err.message) || 'Auth failed');
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        const res = await apiFetch('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            role: 'student',
            name: studentForm.name,
            email: studentForm.email,
            phone: studentForm.phone,
            collegeId: studentForm.collegeId,
            password: studentForm.password,
          }),
        });
        localStorage.setItem('auth_token', res.token);
        setStorage('currentRole', 'student');
        navigate('/students');
      } else {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: studentForm.email, password: studentForm.password })
        });
        localStorage.setItem('auth_token', res.token);
        setStorage('currentRole', 'student');
        navigate('/students');
      }
    } catch (err) {
      alert((err && err.message) || 'Auth failed');
    }
  };

  const renderAdmin = () => (
    <form onSubmit={handleAdminSubmit} className="space-y-4">
      <div className="text-lg font-semibold text-gray-900">{mode === 'signup' ? 'Admin • College Registration' : 'Admin • Login'}</div>
      {mode === 'signup' && (
        <>
          <div>
            <label className="text-sm text-gray-700">College Name</label>
            <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="e.g. St. Xavier's College" value={collegeForm.name} onChange={e => setCollegeForm({ ...collegeForm, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="admin@college.edu" type="email" value={collegeForm.email} onChange={e => setCollegeForm({ ...collegeForm, email: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Phone</label>
              <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="+91 98765 43210" value={collegeForm.phone} onChange={e => setCollegeForm({ ...collegeForm, phone: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700">Address</label>
            <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Street, City, State, PIN" value={collegeForm.address} onChange={e => setCollegeForm({ ...collegeForm, address: e.target.value })} required />
          </div>
        </>
      )}
      <div>
        <label className="text-sm text-gray-700">College ID</label>
        <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Unique College ID (e.g. SXC-DEL-2025)" value={collegeForm.collegeId} onChange={e => setCollegeForm({ ...collegeForm, collegeId: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm text-gray-700">Email</label>
        <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="admin@college.edu" type="email" value={collegeForm.email} onChange={e => setCollegeForm({ ...collegeForm, email: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm text-gray-700">Password</label>
        <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Password" type="password" value={collegeForm.password || ''} onChange={e => setCollegeForm({ ...collegeForm, password: e.target.value })} required />
      </div>
      <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl px-4 py-2 transition shadow">
        {mode === 'signup' ? 'Register College' : 'Enter Admin Panel'}
      </button>
      <p className="text-xs text-gray-600 text-center">You can change college details later from the Admin Profile.</p>
    </form>
  );

  const renderTeacher = () => (
    <form onSubmit={handleTeacherSubmit} className="space-y-4">
      <div className="text-lg font-semibold text-gray-900">{mode === 'signup' ? 'Teacher • Join a College' : 'Teacher • Login'}</div>
      {mode === 'signup' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700">Full Name</label>
              <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Your full name" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="you@example.com" type="email" value={teacherForm.email} onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700">Phone</label>
              <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Contact number" value={teacherForm.phone} onChange={e => setTeacherForm({ ...teacherForm, phone: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Department</label>
              <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="e.g. Computer Science" value={teacherForm.department} onChange={e => setTeacherForm({ ...teacherForm, department: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700">Qualification</label>
            <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="e.g. M.Tech, PhD" value={teacherForm.qualification} onChange={e => setTeacherForm({ ...teacherForm, qualification: e.target.value })} required />
          </div>
        </>
      )}
      <div>
        <label className="text-sm text-gray-700">College ID</label>
        <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Provided by your Admin" value={teacherForm.collegeId} onChange={e => setTeacherForm({ ...teacherForm, collegeId: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm text-gray-700">Email</label>
        <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="you@example.com" type="email" value={teacherForm.email} onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm text-gray-700">Password</label>
        <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Password" type="password" value={teacherForm.password} onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })} required />
      </div>
      <button className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white rounded-xl px-4 py-2 transition shadow">
        {mode === 'signup' ? 'Register as Teacher' : 'Enter Teacher Portal'}
      </button>
      <p className="text-xs text-gray-600 text-center">After approval by Admin, you can create classes and invite students.</p>
    </form>
  );

  const renderStudent = () => (
    <form onSubmit={handleStudentSubmit} className="space-y-4">
      <div className="text-lg font-semibold text-gray-900">{mode === 'signup' ? 'Student • Sign up' : 'Student • Login'}</div>
      {mode === 'signup' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700">Full Name</label>
              <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Your full name" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Phone</label>
              <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Contact number" value={studentForm.phone} onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700">College ID</label>
            <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Provided by your Admin" value={studentForm.collegeId} onChange={e => setStudentForm({ ...studentForm, collegeId: e.target.value })} required />
          </div>
        </>
      )}
      <div>
        <label className="text-sm text-gray-700">Email</label>
        <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="you@example.com" type="email" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} required />
      </div>
      <div>
        <label className="text-sm text-gray-700">Password</label>
        <input className="w-full glass-input rounded-xl px-4 py-2 bg-white/60 border border-white/40" placeholder="Password" type="password" value={studentForm.password} onChange={e => setStudentForm({ ...studentForm, password: e.target.value })} required />
      </div>
      <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl px-4 py-2 transition shadow">
        {mode === 'signup' ? 'Create Account' : 'Enter Student Portal'}
      </button>
    </form>
  );

  const RoleCard = useMemo(() => (
    <div className="max-w-xl w-full backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
      <div className="flex gap-2 mb-5">
        <button onClick={() => setRole('admin')} className={`px-4 py-2 rounded-xl transition-all ${role === 'admin' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow' : 'bg-white/60 border border-white/40'}`}>Admin</button>
        <button onClick={() => setRole('teacher')} className={`px-4 py-2 rounded-xl transition-all ${role === 'teacher' ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow' : 'bg-white/60 border border-white/40'}`}>Teacher</button>
        <button onClick={() => setRole('student')} className={`px-4 py-2 rounded-xl transition-all ${role === 'student' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow' : 'bg-white/60 border border-white/40'}`}>Student</button>
        <div className="ml-auto flex gap-1 p-1 rounded-xl bg-white/60 border border-white/40">
          <button onClick={() => setMode('login')} className={`px-3 py-1.5 rounded-lg transition ${mode === 'login' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}>Login</button>
          <button onClick={() => setMode('signup')} className={`px-3 py-1.5 rounded-lg transition ${mode === 'signup' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}>Sign up</button>
        </div>
      </div>
      <style>{`.glass-input{background:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.5);box-shadow:inset 0 1px 2px rgba(0,0,0,0.04);} .glass-input:focus{outline:none;box-shadow:0 0 0 3px rgba(59,130,246,0.25);}`}</style>
      <div className="space-y-3">
        {role === 'admin' && (
          <div className="space-y-3">{renderAdmin()}</div>
        )}
        {role === 'teacher' && (
          <div className="space-y-3">{renderTeacher()}</div>
        )}
        {role === 'student' && (
          <div className="space-y-3">{renderStudent()}</div>
        )}
      </div>
    </div>
  ), [role, mode, collegeForm, teacherForm, studentForm, studentJoinId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />

      <div className="relative px-4 py-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="backdrop-blur-md bg-white/60 rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              College ERP
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your educational institution with our comprehensive management platform.
              Streamline operations, enhance collaboration, and empower every stakeholder.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg">🏛️ College Management</span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-full shadow-lg">👨‍🏫 Teacher Portal</span>
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg">🎓 Student Dashboard</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Everything You Need to Manage Your Institution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Admin Feature */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-8 hover:bg-white/80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">College Administration</h3>
              <p className="text-gray-700 mb-6">Register your institution, manage teacher approvals, and oversee all academic operations from a centralized dashboard.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• College registration & profile management</li>
                <li>• Teacher approval workflow</li>
                <li>• Comprehensive analytics & reporting</li>
                <li>• Student data oversight</li>
              </ul>
            </div>

            {/* Teacher Feature */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-8 hover:bg-white/80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Teacher Portal</h3>
              <p className="text-gray-700 mb-6">Create and manage classes, track student progress, and share class codes for seamless student enrollment.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Create unlimited classes with unique IDs</li>
                <li>• Real-time student enrollment tracking</li>
                <li>• Assignment & grade management</li>
                <li>• Department-specific organization</li>
              </ul>
            </div>

            {/* Student Feature */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-8 hover:bg-white/80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Student Dashboard</h3>
              <p className="text-gray-700 mb-6">Join classes instantly, access assignments, track progress, and manage your academic journey in one place.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Join classes with simple class codes</li>
                <li>• Assignment submission & tracking</li>
                <li>• Academic progress monitoring</li>
                <li>• Fee & document management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto flex justify-self-center">
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-700 mb-8">Choose your role below to begin your journey with our platform.</p>
            {RoleCard}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


