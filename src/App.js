import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Intropage from './Intropage';
import Signup from './components/Client/Signup';
import Login from './components/Client/Login';
import Dashboard from './components/Client/Dashboard';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDash from './components/Admin/AdminDash';
import Appoinment from './components/Client/Appoinment'
import Doctor from './components/Client/Doctor'
import DocDetail from './components/Client/DocDetail';
import Pharmacy from './components/Client/Pharmacy';
import AddDoc from './components/Admin/AddDoc';
import Profile from './components/Client/Profile';


function App() {
  return (
    
    <><Router>
    <div>
      <Routes>
        <Route path="/" element={<Intropage/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/dashboard/appoinment" element={<Appoinment/>}/>
        <Route path="/dashboard/pharmacy" element={<Pharmacy/>}/>
        <Route path="/dashboard/doctors" element={<Doctor/>}/>
        <Route path="/dashboard/DocDetails/:id" element={<DocDetail/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<AdminDash/>}/>
        <Route path="/admin/addDoctor" element={<AddDoc/>}/>
      </Routes>
    </div>
  </Router></>
  );
}

export default App;
