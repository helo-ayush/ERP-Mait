import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Bell, 
  Calendar, 
  BookOpen, 
  Users, 
  DollarSign,
  Home,
  Plus,
  Pin,
  MapPin,
  ExternalLink,
  AlertCircle,
  File,
  Book
} from 'lucide-react';

const Dashboard = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete Physics Assignment', completed: false, dueDate: '2024-09-16' },
    { id: 2, text: 'Study for Chemistry Test', completed: true, dueDate: '2024-09-15' },
    { id: 3, text: 'Submit Project Report', completed: false, dueDate: '2024-09-18' }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDate, setNewTodoDate] = useState('');

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
  if (newTodo.trim() && newTodoDate.trim()) {
    const baseDate = new Date(newTodoDate); // convert string -> Date
    baseDate.setDate(baseDate.getDate() + 7); // add 7 days

    setTodos([...todos, {
      id: Date.now(),
      text: newTodo,
      completed: false,
      dueDate: baseDate.toISOString().split('T')[0] // format as YYYY-MM-DD
    }]);

    setNewTodo('');
    setNewTodoDate('');
  }
};

  const updates = [
    { id: 1, title: 'Mid-term Exam Schedule Released', date: '2024-09-14', pinned: true, category: 'Academic' },
    { id: 2, title: 'Library Timings Changed', date: '2024-09-13', pinned: false, category: 'Notice' },
    { id: 3, title: 'Cultural Fest Registration Open', date: '2024-09-12', pinned: true, category: 'Events' }
  ];

  const schedule = [
    { time: '09:00 AM', subject: 'Physics', teacher: 'Dr. Smith', room: 'Room 201', type: 'Lecture' },
    { time: '11:00 AM', subject: 'Mathematics', teacher: 'Prof. Johnson', room: 'Room 105', type: 'Tutorial' },
    { time: '02:00 PM', subject: 'Chemistry Lab', teacher: 'Dr. Brown', room: 'Lab 3', type: 'Practical' },
    { time: '04:00 PM', subject: 'English', teacher: 'Ms. Davis', room: 'Room 302', type: 'Lecture' }
  ];

  const libraryBooks = [
    { title: 'Advanced Physics', dueDate: '2024-09-20', daysLeft: 6, author: 'John Doe' },
    { title: 'Organic Chemistry', dueDate: '2024-09-18', daysLeft: 4, author: 'Jane Smith' },
    { title: 'Linear Algebra', dueDate: '2024-09-25', daysLeft: 11, author: 'Mike Wilson' }
  ];

  // Attendance calendar data (simplified)
  const attendanceData = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    attendanceData.push({
      date: date.toISOString().split('T')[0],
      attendance: Math.random() > 0.2 ? Math.floor(Math.random() * 4) + 1 : 0
    });
  }

  const getAttendanceColor = (count) => {
    if (count === 0) return 'bg-gray-200';
    if (count === 1) return 'bg-green-200';
    if (count === 2) return 'bg-green-300';
    if (count === 3) return 'bg-green-400';
    return 'bg-green-500';
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Hey there! 👋</h1>
          <p className="text-gray-700 font-medium text-sm md:text-base">Ready to conquer today? Here's what's happening.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* My Tasks Card */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                My Tasks
              </h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {todos.filter(t => !t.completed).length} pending
              </span>
            </div>
            
            <div className="space-y-3 mb-4 overflow-y-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {todos.map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {todo.completed && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                  <span className="text-xs text-gray-500">{todo.dueDate}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 flex-col md:flex-row">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add new task..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />

              <div className='flex gap-2'>
                <input
                  type="date"
                  value={newTodoDate}
                  onChange={(e) => setNewTodoDate(e.target.value)}
                  placeholder="Add new task..."
                  className="flex-1 px-3 py-2 text-gray-500 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <button
                  onClick={addTodo}
                  className="px-3 py-2 w-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
              </button>
              </div>
            </div>
          </div>

          {/* Updates Card */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Updates
              </h2>
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                {updates.filter(u => u.pinned).length} pinned
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {updates.map(update => (
                <div key={update.id} className="p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {update.pinned && <Pin className="w-3 h-3 text-red-500" />}
                        <span className="text-sm font-medium text-gray-800">{update.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{update.date}</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {update.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Schedule Card */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Today's Schedule
              </h2>
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                {schedule.length} classes
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                  <div className="w-16 text-xs font-medium text-gray-600">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{item.subject}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <span>{item.teacher}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.room}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.type === 'Lecture' ? 'bg-blue-100 text-blue-700' :
                    item.type === 'Tutorial' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Library Card */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Library Books
              </h2>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                {libraryBooks.length} books
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {libraryBooks.map((book, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm mb-1">{book.title}</div>
                      <div className="text-xs text-gray-600">by {book.author}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      book.daysLeft <= 3 ? 'bg-red-100 text-red-700' :
                      book.daysLeft <= 7 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {book.daysLeft} days left
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Due: {book.dueDate}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Card */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Attendance
              </h2>
              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                87% overall
              </span>
            </div>
            
            <div className="mb-4">
              <div className="grid grid-cols-10 gap-1 mb-3">
                {attendanceData.slice(0, 30).reverse().map((day, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-sm ${getAttendanceColor(day.attendance)} tooltip`}
                    title={`${day.date}: ${day.attendance} classes`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-300"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                </div>
                <span>More</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-800">26</div>
                <div className="text-gray-600">Present Days</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">4</div>
                <div className="text-gray-600">Absent Days</div>
              </div>
            </div>
          </div>

          {/* Fee Status Card */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Fee Status
              </h2>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                Paid
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">$2,500</div>
                  <div className="text-xs text-gray-600">Semester Fee</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">$0</div>
                  <div className="text-xs text-gray-600">Due Amount</div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">All fees paid for this semester</span>
                </div>
                <div className="text-xs text-green-600 mt-1">Last payment: Sep 1, 2024</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-4 md:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] col-span-1 xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                Quick Actions
              </h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Request Certificate', icon: ExternalLink, color: 'blue' },
                { label: 'Apply for Leave', icon: Calendar, color: 'green' },
                { label: 'Raise Ticket', icon: AlertCircle, color: 'orange' },
                { label: 'View Hostel Info', icon: Home, color: 'purple' }
              ].map((action, index) => (
                <button
                  key={index}
                  className={`p-3 md:p-4 bg-white/50 hover:bg-white/70 rounded-lg transition-all duration-200 hover:scale-105 flex flex-col items-center gap-1 md:gap-2 border-2 border-transparent hover:border-${action.color}-200`}
                >
                  <action.icon className={`w-5 h-5 md:w-6 md:h-6 text-${action.color}-500`} />
                  <span className="text-xs md:text-sm font-medium text-gray-700 text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
