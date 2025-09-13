import React from 'react'
import { House,  DollarSign, FileTextIcon, File, Book, BookOpen, LayoutGrid, Settings, LogOut } from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
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
        <div className='flex w-screen h-screen bg-[#f1f3f3]'>

            {/* SideBar */}
            <div className='flex flex-col w-50 h-[95vh] bg-[#f5f5f5] m-4 rounded-[30px] p-1 justify-self-center items-center shadow-[0_0px_10px_0px_rgba(0,0,0,0.05)]'>
                {/* User Profile */}
                <div className='flex justify-center'>
                    <img src={logo} className='mt-5 w-[90%] mb-12 select-none cursor-pointer' onClick={() =>{navigate('/')}} alt="" />
                </div>

                <div className='flex flex-col gap-2'>
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/students'}
                            className={({ isActive }) => `px-4.5 py-2.5 flex items-center gap-4 rounded-2xl text-sm font-medium ${isActive ? 'bg-[#232323] text-white' : 'text-gray-600 hover:bg-gray-200 transition duratioon-300 hover:scale-105'} `}
                        >
                            <Icon className='w-5 h-5' />
                            {label}
                        </NavLink>
                    ))}
                </div>

                <div className='absolute bottom-15 flex flex-col gap-2'>
                    <div className='px-4.5 py-2.5 cursor-pointer flex items-center gap-4 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition duratioon-300 hover:scale-105'>                        
                        <Settings className='w-5 h-5'/>
                        <div>Setting</div>
                    </div>
                    <div className='px-4.5 py-2.5 cursor-pointer flex items-center gap-4 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition duratioon-300 hover:scale-105'>                        
                        <LogOut className='w-5 h-5'/>
                        <div>Log out</div>
                    </div>
                </div>      
            </div>
            <Outlet />
        </div>

    )
}

export default Layout