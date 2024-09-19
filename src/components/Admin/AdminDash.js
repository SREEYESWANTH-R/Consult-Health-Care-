import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LocalHospital, AccountCircle, MedicationLiquid, AccountBalanceWallet, AccessibleForward, Close } from '@mui/icons-material';
import './AdminDash.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {BarChart as ReBarChart, Bar,XAxis, YAxis,CartesianGrid,Tooltip,Legend,} from 'recharts';



function AdminDash() {
  const [appointments, setAppointments] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [appoinmentCount, setAppoinmentCount] = useState(0);
  const [doctorCount, setDocotorCount] = useState(0);

  function getAppoinment() {
    axios.get('http://localhost:3000/admin/dashboard')
      .then(response => {
        const updatedAppointments = response.data.map(appointment => ({ ...appointment, status: 'Active' }));
        setAppointments(updatedAppointments);
      })
      .catch(error => {
        console.error("Error fetching appointment details:", error);
      });
  }

  function getActiveCount() {
    axios.get('http://localhost:3000/analytics')
      .then(response => {
        setActiveCount(response.data.ActiveCount);
        setAppoinmentCount(response.data.AppointmentCount);
        setDocotorCount(response.data.DoctorCount)
      })
      .catch(error => {
        console.error("Error fetching active count:", error);
      });
  }


  useEffect(() => {
    getAppoinment();
    getActiveCount();
  }, []);

  function handleDelete(id) {
    axios.post('http://localhost:3000/admin/appointment/delete', { id })
      .then(response => {
        console.log(response.data.message);
        getAppoinment(); // Refresh the appointment list after deletion
      })
      .catch(error => {
        console.error("Error deleting appointment:", error);
      });
  }

  function handleStatus(index) {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status = 'Done';
    setAppointments(updatedAppointments);
  }

  const data = [
    { name: 'Analytics', User: activeCount, Appoinment: appoinmentCount, Doctor: doctorCount },
  ];

  return (
    <div className='adminlog-cont'>
      <header className='admin-head'>
        <div className='admin-logo'>
          <LocalHospital fontSize='large' style={{ color: 'blue' }} />
          <h3>Consult</h3>
        </div>
        <div className='admin-profile'>
          <AccountCircle fontSize='large' />
          <h4>ADMIN</h4>
        </div>
      </header>
      <div className='appoinment-block'>
        <div className='sideBar-admin'>
          <ul>
            <li className='side-items'><AccessibleForward style={{ color: 'blue' }} /><Link to='/admin/addDoctor' style={{textDecoration:'none'}}>Doctors</Link></li>
            <li className='side-items'><MedicationLiquid style={{ color: 'blue' }} /><a href=''>Medicine</a></li>
            <li className='side-items'><AccountBalanceWallet style={{ color: 'blue' }} /><a href=''>Billing</a></li>
          </ul>
          <Button variant="contained" style={{ backgroundColor: 'blue' }} type='submit'>Logout</Button>
        </div>

        <div className='app-main'>
          <div className='Analytics'>
            <div className='Analytcs-Cards'>
              <p>Active Count</p>
              <p>{activeCount}</p>
            </div>
            <div className='Analytcs-Cards'>
              <p>Appoinment Count</p>
              <p>{appoinmentCount}</p>
            </div>
            <div className='Analytcs-Cards'>
              <p>Doctors Count</p>
              <p>{doctorCount}</p>
            </div>
          </div>
          <div className='analytics-graph'>
            <ReBarChart width={730} height={250} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Analytics" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="User" fill="#8884d8" />
              <Bar dataKey="Appoinment" fill="#82ca9d" />
              <Bar dataKey="Doctor" fill="#82ca9q" />
            </ReBarChart>
          </div>
        </div>

      

        <div className='appoint-card'>
          <h3>Appointment</h3>
          {appointments.map((appointment, index) => (
            <div key={index} className='appointment-card'>
              <div className='apt-status' id='apt-status'>
                <p id='active' style={{fontWeight:'bold' ,color: appointment.status === 'Active' ? 'red' : 'green' }}>{appointment.status}</p>
                <Close style={{ fontSize: 'small' }} onClick={() => handleDelete(appointment.id)} />
              </div>
              <h4>Name: {appointment.name}</h4>
              <p>Doctor: {appointment.doctor}</p>
              <p>Age: {appointment.age}</p>
              <p>Gender: {appointment.gender}</p>
              <p>Address: {appointment.address}</p>
              <p>Mobile Number: {appointment.mobNum}</p>
              <Button variant="contained" style={{ backgroundColor: 'blue' }} 
                type='submit'
                id='statBtn'
                onClick={() => handleStatus(index)}>
                Checked
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDash;
