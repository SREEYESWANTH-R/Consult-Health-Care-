import React, { useState } from 'react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import { Button, TextField } from '@mui/material';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");

  axios.defaults.withCredentials = true;

  const navigate = useNavigate(); 

  async function handleLogin(event) {
    event.preventDefault();
    try{
      if(email != null && password.trim() != null){
        const response = await axios.post("http://localhost:3000/login", {
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
          <Button variant="contained" style={{ backgroundColor: 'blue' }} type='submit'>Login</Button>
          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
