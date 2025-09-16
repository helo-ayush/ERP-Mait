import React from 'react';
import {
  Home,
  BedDouble,
  IndianRupee,
  Wifi,
  WashingMachine,
  ShieldCheck,
  Utensils,
  Sun,
  Moon,
  Wind,
  Info,
  Wrench,
  ClipboardCheck,
  Users,
  UserCheck,
  Phone,
  ArrowRight
} from 'lucide-react';
import { getEnv, openExternal } from '../utils/env';

const Hostel = () => {
  const { apiBaseUrl } = getEnv();
  // Mock Data
  const myRoomDetails = {
    block: 'A',
    room: '201',
    type: '2-Seater (AC)',
    status: 'Allocated',
    paidOn: 'July 15, 2025',
    roommates: ['Ankit Sharma'],
  };

  const roomOptions = [
    { type: '2-Seater (AC)', fee: 140000, available: true },
    { type: '2-Seater (Non-AC)', fee: 120000, available: true },
    { type: '3-Seater (AC)', fee: 110000, available: false },
    { type: '3-Seater (Non-AC)', fee: 95000, available: true },
  ];
  
  const facilities = [
    { name: 'Laundry Service', icon: WashingMachine },
    { name: '24/7 Wi-Fi', icon: Wifi },
    { name: 'Veg Mess', icon: Utensils },
    { name: '24x7 Security', icon: ShieldCheck },
    { name: 'Housekeeping', icon: Wind },
    { name: 'Recreation & Gym', icon: Sun },
  ];

  const hostelStaff = [
    { name: 'Dr. R.K. Verma', role: 'Chief Warden', phone: '+91 98765 43210' },
    { name: 'Ms. Sunita Singh', role: 'Asst. Warden (Girls)', phone: '+91 98765 43211' },
  ];

  const QuickActionCard = ({ icon: Icon, title, description, color, onClick }) => (
    <button onClick={onClick} className={`p-4 bg-white/50 hover:bg-white/70 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-4 border-2 border-transparent hover:border-${color}-200`}>
        <Icon className={`w-8 h-8 text-${color}-500 flex-shrink-0`} />
        <div>
            <h4 className="font-semibold text-gray-800 text-left">{title}</h4>
            <p className="text-xs text-gray-600 text-left">{description}</p>
        </div>
    </button>
  );

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide">
        <style>{`
            /* Tailwind JIT helpers */
            .border-blue-200{} .text-blue-500{}
            .border-purple-200{} .text-purple-500{}
            .border-green-200{} .text-green-500{}
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      
        {/* Header */}
        <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Hostel Accomodation</h1>
            <p className="text-gray-700 font-medium text-sm md:text-base">Your home away from home. Manage your stay, requests, and fees.</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

            {/* Left & Middle Column */}
            <div className="lg:col-span-2 space-y-6">
                {/* My Room Details Card */}
                <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <UserCheck className="w-5 h-5 text-green-500" />
                        My Room Details
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-white/50 rounded-lg">
                            <p className="text-xs text-gray-600">Hostel Block</p>
                            <p className="text-lg font-bold text-gray-800">{myRoomDetails.block}</p>
                        </div>
                        <div className="p-3 bg-white/50 rounded-lg">
                            <p className="text-xs text-gray-600">Room No.</p>
                            <p className="text-lg font-bold text-gray-800">{myRoomDetails.room}</p>
                        </div>
                         <div className="p-3 bg-white/50 rounded-lg">
                            <p className="text-xs text-gray-600">Room Type</p>
                            <p className="text-lg font-bold text-gray-800">{myRoomDetails.type}</p>
                        </div>
                        <div className="p-3 bg-green-100/70 rounded-lg">
                            <p className="text-xs text-green-800">Status</p>
                            <p className="text-lg font-bold text-green-700">{myRoomDetails.status}</p>
                        </div>
                    </div>
                     <div className="mt-4 border-t border-white/50 pt-4 text-sm text-gray-700">
                        <span className="font-semibold">Roommate:</span> {myRoomDetails.roommates.join(', ')}
                    </div>
                </div>

                {/* Room Options & Fees Card */}
                <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <BedDouble className="w-5 h-5 text-blue-500" />
                        Room Options & Annual Fees
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roomOptions.map(room => (
                            <div key={room.type} className="p-4 bg-white/50 rounded-xl border border-white/30 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{room.type}</p>
                                    <p className="text-blue-600 font-bold text-lg">₹{room.fee.toLocaleString('en-IN')}</p>
                                </div>
                                <button className={`px-3 py-1 text-xs font-semibold rounded-full ${room.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                    {room.available ? 'Available' : 'Booked'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Facilities & Notes Card */}
                <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <Sun className="w-5 h-5 text-orange-500" />
                        Facilities & Notes
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        {facilities.map(facility => (
                            <div key={facility.name} className="flex items-center gap-3 p-2 bg-white/40 rounded-lg">
                                <facility.icon className="w-5 h-5 text-orange-600"/>
                                <span className="text-sm font-medium text-gray-700">{facility.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg text-sm text-blue-800 space-y-2">
                        <p><span className="font-semibold">Payment:</span> Hostel fees are charged annually.</p>
                        <p><span className="font-semibold">Allocation:</span> Limited seats are available on a first-come, first-serve basis.</p>
                        <p><span className="font-semibold">Security Deposit:</span> Refundable at the end of the course, subject to clearance.</p>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
                {/* Quick Actions */}
                <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                       <QuickActionCard onClick={() => openExternal(`${apiBaseUrl}/hostel/maintenance/new`)} icon={Wrench} title="Maintenance Request" description="Report an issue in your room." color="blue" />
                       <QuickActionCard onClick={() => openExternal(`${apiBaseUrl}/hostel/gate-pass/apply`)} icon={ClipboardCheck} title="Apply for Gate Pass" description="Request for overnight leave." color="purple" />
                       <QuickActionCard onClick={() => openExternal(`${apiBaseUrl}/hostel/rules`)} icon={Info} title="Rules & Regulations" description="Read the hostel guidelines." color="green" />
                    </div>
                </div>
                
                 {/* Hostel Staff */}
                <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-purple-500" />
                        Hostel Staff
                    </h2>
                    <div className="space-y-4">
                        {hostelStaff.map(staff => (
                            <div key={staff.name} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-700">
                                    {staff.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{staff.name}</p>
                                    <p className="text-xs text-gray-600">{staff.role}</p>
                                    <div className="flex items-center gap-1 text-xs text-purple-600 mt-1">
                                        <Phone className="w-3 h-3"/>
                                        <span>{staff.phone}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Hostel;