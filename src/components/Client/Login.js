import React, { useState } from 'react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import { Button, TextField, Modal} from '@mui/material';
import axios from 'axios';
import { ModalDialog, ModalClose} from '@mui/joy';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [oldPass,setOldPass] = useState("");
  const [passChangeEmail, setPassChangeEmail] = useState("");
  const [newPass, setNewPass] = useState("");

  axios.defaults.withCredentials = true;

  const navigate = useNavigate(); 

  async function handleLogin(event) {
    event.preventDefault();
    try{
      if(email != null && password.trim() != null){
        const response = await axios.post("/auth/login", {
          Email: email,
          password: password
        })
        if(response.status === 200){
          setMessage("Login Successful");
          setTimeout(()=>{
            navigate('/dashboard');
          },1000)
        }else{
          setMessage("Login Successfull");
        }
      }else{
        setError("Email and Password Should Not be empty");
      }
    }catch(error){
      console.error("Login Failed ! Invalid User Details",error)
    }
  }

  const handleModalOpen = ()=>{
    setOpenModal(true);
  }
  
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handlePassChange = ()=>{
    axios.put('/auth/change-password',{
      passChangeEmail,
      oldPass,
      newPass
    }).then(()=>{
      alert("password updated successfully");
    }).catch((error)=>{
      console.log('error',error);
    })
  }

  return (
    <div>
      <header className='header'>
        <div className='logo-sec'>
          <LocalHospitalIcon fontSize='large' style={{ color: 'blue' }} />
          <h3>Consult</h3>
        </div>
        <ul className='nav'>
          <li className='nav-item'>
            <Button variant="contained" style={{ backgroundColor: 'blue' }}>
              <Link className='link-a' to="/signup">SignIn</Link>
            </Button>
          </li>
        </ul>
      </header>
      <div className='login-form'>
        <h2>Login with us</h2>
        <p>Your information is safe with us!!</p>
        <form onSubmit={handleLogin} className="loginform">
          <TextField
            required
            fullWidth
            helperText={error}
            id="outlined-basic"
            label="Email"
            value={email}
            variant="outlined"
            onChange={e => setEmail(e.target.value)} />
          <TextField
            required
            fullWidth
            helperText={error}
            id="outlined-basic"
            label="Password"
            value={password}
            type='password'
            variant="outlined"
            onChange={e => setPassword(e.target.value)}
          />
          <p onClick={handleModalOpen} style={{cursor:'pointer'}}>Forgot Password?</p>
          <Button variant="contained" style={{ backgroundColor: 'blue' }} type='submit'>Login</Button>
          <p>{message}</p>
          
        </form>
      </div>

      <Modal open={openModal} onClose={handleModalClose}>
        <ModalDialog variant="solid" color='white' sx={{width:'50%',textAlign:'center'}} >
          <ModalClose onClick={handleModalClose} />
            
            <TextField
              required
              fullWidth
              helperText={error}
              id="outlined-basic"
              label="Email"
              value={passChangeEmail}
              variant="outlined"
              onChange={e => setPassChangeEmail(e.target.value)}
              style={{marginTop:'20px'}} />
            
            <TextField
              required
              helperText={error}
              id="outlined-basic"
              label="Old Password"
              value={oldPass}
              type='password'
              variant="outlined"
              onChange={e => setOldPass(e.target.value)}
              
            />

            <TextField
              required
              helperText={error}
              id="outlined-basic"
              label="New Password"
              value={newPass}
              type='password'
              variant="outlined"
              onChange={e => setNewPass(e.target.value)}
            />
            
          <Button variant="contained" style={{ backgroundColor: 'green',width:'200px', margin:"auto "}} type='submit' fontSize='small' onClick={handlePassChange}>Change Password </Button>
        </ModalDialog>
      </Modal>

    </div>
  );
}

export default Login;
