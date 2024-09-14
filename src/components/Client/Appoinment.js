import React, { useState,useEffect } from 'react'
import './Appoinment.css'
import { Button, TextField, InputLabel,MenuItem,FormControl,Select } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; 
import axios from "axios";

function Appoinment(){
   
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [chooseDoc, setchooseDoc] = useState("");
  const [date,setDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      const response = await axios.get("http://localhost:3000/dashboard/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors data", error);
    }
  }

  async function handleAppoinment(event){
    event.preventDefault();
    axios.post("http://localhost:3000/appoinment",{
      name,age,gender,mobile,address,chooseDoc,date
    }).then((response)=>{
      setSuccessMsg(response.data.message);
      axios.post('http://localhost:3000/notify-admin',{
        name,age,mobile,address,chooseDoc,date
      }).then((adminresponse)=>{
          console.log("Admin-Notified",adminresponse.data);
      }).catch((error)=>{
        console.error("Admin Not notified",error);
      })
      // axios.post('http://localhost:3000/notify-mobile',{name,date,mobile})
      //   .then(mobileRes => {
      //     console.log("Nofication sent to mobile",mobileRes);
      //   }).catch(err =>{
      //     console.error("Failed to send notification",err);
      //   });
    }).catch((error)=>{
      console.error("Error during making the appoinment",error);
    })
  }

  //preventing from choosing previous or earlier date
  const today = new Date().toISOString().split('T')[0];

  const handleDoctorChange = (event) => {
    setchooseDoc(event.target.value);
  };
  
  return (
    <div className='Apoint-cont'>
        <header className='header'>
        <div className='logo-sec'>
          <LocalHospitalIcon fontSize='large' style={{ color: 'blue' }} />
          <h3>Consult</h3>
        </div>
        </header>
       
           
        <div className='Apoint-form'>
            <h1>Make Your Appoinment With US</h1>
            <p>Your health is your most valuable asset. Take the first step towards a healthier you today</p>
 
          <form className='appForm' onSubmit={handleAppoinment}>
            <TextField
                required
                fullwidth
                helperText=""
                id="outlined-basic"
                label="Name"
                value = {name}
                variant="outlined"
                onChange={e=>{setName(e.target.value)}}
            />
            <TextField
                required
                fullwidth
                helperText=""
                id="outlined-basic"
                value = {age}
                label="Age"
                variant="outlined"
                onChange={e => {setAge(e.target.value)}}
            />
            <TextField
                required
                fullwidth
                helperText=""
                id="outlined-basic"
                value = {gender}
                label="Gender"
                variant="outlined"
                onChange={ e => {setGender(e.target.value)}}
            />

            <FormControl fullWidth>
              <InputLabel id="doctor-select-label">Doctor</InputLabel>
              <Select
                labelId="doctor-select-label"
                id="doctor-select"
                value={chooseDoc}
                onChange={handleDoctorChange}
                label="Doctor"
                required
              >
                {doctors.map(doc => (
                  <MenuItem key={doc.id} value={doc.name}>{doc.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              required
              type="date"
              fullWidth
              helperText=""
              id="outlined-basic"
              value={date}
              variant="outlined"
              onChange={e => { setDate(e.target.value); }}
              inputProps={{min:today}}
              style={{marginBottom:"1em"}}
            />

            <TextField
                required
                fullwidth
                helperText=""
                id="outlined-basic"
                value = {mobile}
                label="Mobile Number"
                variant="outlined"
                onChange={e => {setMobile(e.target.value)}}
            />
            <TextField
              required
              fullwidth
              minRows={3}
              value = {address}
              placeholder="Address"
              onChange={e => {setAddress(e.target.value)}}
            />
            <Button variant="contained" style={{ backgroundColor: 'blue' }} type='submit'>Confirm</Button>
            <p>{successMsg}</p>
          </form>
        </div>
    </div>
  )
}

export default Appoinment