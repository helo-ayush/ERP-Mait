import React from 'react'
import { House,  DollarSign, FileTextIcon, File, Book, BookOpen, LayoutGrid, Settings, LogOut } from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import logoWtxt from '../assets/logoWithoutText.png'
import { useNavigate } from 'react-router-dom'

const navItems = [
  {to: '/students' , label:'Dashboard' , Icon: LayoutGrid},
  {to: '/students/fees' , label:'Fees' , Icon: DollarSign},
  {to: '/students/hostel' , label:'Hostel' , Icon: House},
  {to: '/students/documents' , label:'Documents' , Icon: FileTextIcon},
  {to: '/students/assignment' , label:'Assignment' , Icon: File},
  {to: '/students/notes' , label:'Notes' , Icon: Book},
  {to: '/students/reports' , label:'Reports' , Icon: BookOpen},
]

const Layout = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 scrollbar-hide'>
            
            {/* Navigation Bar for Small Screens */}
            <div className='sm:hidden w-full absolute px-4 py-2 z-10'>
                <div className='backdrop-blur-md bg-white/40 border border-white/30 rounded-2xl p-3 shadow-[0_0px_10px_0px_rgba(0,0,0,0.05)]'>
                    <div className='flex items-center justify-between overflow-x-auto scrollbar-hide'>
                        {/* Navigation Items */}
                        <div className='flex gap-1 flex-shrink-0'>
                            {navItems.map(({ to, label, Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={to === '/students'}
                                    className={({ isActive }) => `p-2.5 flex items-center justify-center rounded-xl text-sm font-medium flex-shrink-0 ${isActive ? 'bg-[#232323] text-white' : 'text-gray-600 hover:bg-gray-200 transition duration-300'} `}
                                >
                                    <Icon className='w-5 h-5' />
                                </NavLink>
                            ))}
                        </div>
                        
                        {/* Settings and Logout for Small Screens */}
                        <div className='flex gap-1 ml-2 flex-shrink-0'>
                            <div className='p-2.5 cursor-pointer flex items-center justify-center rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition duration-300'>                        
                                <Settings className='w-5 h-5'/>
                            </div>
                            <div className='p-2.5 cursor-pointer flex items-center justify-center rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition duration-300'>                        
                                <LogOut className='w-5 h-5'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col sm:flex-row flex-1 overflow-hidden'>
                {/* SideBar for larger screens */}
                <div className='hidden sm:flex flex-col w-20 md:w-50 h-full bg-[#f5f5f5] m-4 rounded-[30px] p-1 justify-start items-center shadow-[0_0px_10px_0px_rgba(0,0,0,0.05)]'>
                    {/* User Profile */}
                    <div className='flex justify-center'>
                        <img src={logo} className='mt-5 w-[90%] mb-12 select-none cursor-pointer hidden md:block ' onClick={() =>{navigate('/')}} alt="" />
                        <img src={logoWtxt} className='mt-5 w-[30px] mb-12 select-none cursor-pointer md:hidden ' onClick={() =>{navigate('/')}} alt="" />
                    </div>

                    <div className='flex flex-col gap-2'>
                        {navItems.map(({ to, label, Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/students'}
                                className={({ isActive }) => `px-4.5 py-2.5 flex items-center gap-4 rounded-2xl text-sm font-medium ${isActive ? 'bg-[#232323] text-white' : 'text-gray-600 hover:bg-gray-200 transition duration-300 hover:scale-105'} `}
                            >
                                <Icon className='w-5 h-5' />
                                <span className="hidden md:inline">{label}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className='mt-auto mb-4 flex flex-col gap-2'>
                        <div className='px-4.5 py-2.5 cursor-pointer flex items-center gap-4 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition duration-300 hover:scale-105'>                        
                            <Settings className='w-5 h-5'/>
                            <div className="hidden md:inline">Setting</div>
                        </div>
                        <div className='px-4.5 py-2.5 cursor-pointer flex items-center gap-4 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition duration-300 hover:scale-105'>                        
                            <LogOut className='w-5 h-5'/>
                            <div className="hidden md:inline">Log out</div>
                        </div>
                    </div>      
                </div>

                {/* Main Content Area */}
                <div className='flex-1 overflow-auto p-4 sm:pr-4 sm:py-4 sm:pl-0'>
                    <div className='h-full mt-15 sm:mt-0'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout
