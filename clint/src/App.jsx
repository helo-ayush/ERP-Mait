import React, { useState } from 'react';
import { Route, Router, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Hostel from './pages/Hostel';
import Fees from './pages/Fees';
import Assignment from './pages/Assignment';
import Notes from './pages/Notes';
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import Teachers from './pages/Teachers'
import Admin from './pages/Admin'

const App = () => {
  return (
    <Routes>  
        <Route path='/' element={<Home/>}/>
        <Route path='/students' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='hostel' element={<Hostel/>}/>
          <Route path='fees' element={<Fees/>}/>
          <Route path='assignment' element={<Assignment/>}/>
          <Route path='notes' element={<Notes/>}/>
          <Route path='reports' element={<Reports/>}/>
          <Route path='documents' element={<Documents/>}/>
        </Route>  
        <Route path='/teachers' element={<Teachers/>}/>
        <Route path='/admin' element={<Admin/>}/>

      </Routes>
  )
}

export default App