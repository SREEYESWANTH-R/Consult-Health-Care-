import React,{useState} from 'react';
import './Signup.css';
import { Link,useNavigate} from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import {Button,TextField} from '@mui/material';
import  axios  from 'axios';

function Signup(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass ] = useState("");
  const [error,setError] = useState('');
  const [message,setMessage] = useState("");
  const navigate = useNavigate();
  
 async function handleSignup(event){
    event.preventDefault();
    if(password.trim() === confirmPass.trim()){
        const userData = {
            Name: name,
            Email:email,
            Password:password
        }
        try{
            const response = await axios.post("/auth/signup",userData);
            if(response.status === 200){
                setMessage("Account Created Successfully");
                setTimeout(()=>{
                    navigate('/login');
                },1000)
            }
        }catch(error){
            console.error("Invalid Credentials",error);
        }
        }else{
            setError("Password mismatch")
            setMessage("Account Not Created")
        }
 }

  return (
    <div>
        <header className='header'>
            <div className='logo-sec'>
                <LocalHospitalIcon fontSize='large' style={{ color: 'blue'}} />
                <h3>Consult</h3>
            </div>
            <ul className='nav'>
                <li className='nav-item'><Button variant="contained" style={{ backgroundColor: 'blue'}}><Link className='link-a' to="/login">Login</Link></Button></li>
            </ul>
        </header>
        <div className='sign-form'>
            <h2>Register with us</h2>
            <p>your information is safe with us</p>
            <form onSubmit={handleSignup} className='signUpform'>
                <TextField
                    required
                    fullWidth
                    helperText="" 
                    id="outlined-basic"
                    label="Name" 
                    value={name}
                    variant="outlined"
                    onChange={e=>setName(e.target.value)} />
                <TextField
                    required
                    fullWidth
                    helperText="" 
                    id="outlined-basic"
                    label="Email" 
                    value={email}
                    variant="outlined"
                    onChange={e=>setEmail(e.target.value)}/>
                <TextField
                    required
                    fullWidth
                    helperText={error} 
                    id="outlined-basic"
                    label="Password" 
                    value={password}
                    type='password'
                    variant="outlined"
                    onChange={e=>setPassword(e.target.value)}
                     />
                <TextField
                    required
                    fullWidth
                    type='password'
                    helperText={error}
                    id="outlined-basic"
                    label="Confirm password " 
                    value={confirmPass}
                    variant="outlined"
                    onChange={e=>setConfirmPass(e.target.value)}
                />
                <Button variant="contained" style={{ backgroundColor: 'blue'}} type='submit'>SignIn</Button>
                <p>{message}</p>
            </form>
            <p>Already have a Account?<Link to='/login' style={{color:'blue', textDecoration:'none'}}>Login</Link></p>
        </div>
    </div>
  )
}

export default Signup