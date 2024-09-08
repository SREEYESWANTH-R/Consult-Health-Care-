import React,{useEffect,useState} from 'react';
import { useParams,Link} from 'react-router-dom';
import { Button } from '@mui/material';
import {LocalHospital} from '@mui/icons-material'; 
import axios from 'axios'
import './Profile.css'


const Profile = () => {
  const {id} = useParams()
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [address,setAddress] = useState('');
  const [mobile,setMobile] = useState('');
  // const [image,setImage] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const fetchProfile = async() =>{
    try{
      const ProfileRes = await axios.get(`http://localhost:3000/profile/${id}`)
      if(ProfileRes.status === 200){ 
        console.log(ProfileRes)
        setName(ProfileRes.data.result[0].name);
        setEmail(ProfileRes.data.result[0].email);
        setMobile(ProfileRes.data.result[0].mobile); 
        setAddress(ProfileRes.data.result[0].address);
        // setImage(ProfileRes.data.result[0].image); 

      }
    }catch(error){
      console.error("Error fetching profile",error);
    }
  }

  useEffect(()=>{
    fetchProfile();
  },[id]);

  const updateProfile = async(e) => {
    e.preventDefault();
    try{
      const uptRes = await axios.put(`http://localhost:3000/uptprofile/${id}`,{
        Mobile:mobile,
        Address:address
      })
      if(uptRes.status === 200){
        console.log('Profile updated successfully');
        alert("Profile updated successfully")
      }
      setIsEditable(false); 
    }catch(error){
      console.error("",error)
    }
  };


  const handleEditClick = () => {
    setIsEditable(true);
  };

  return (
    <div className='profile-container'>
       <header className='header'>
        <div className='logo-sec'>
          <Link to='/dashboard'><LocalHospital fontSize='large' style={{ color: 'blue'}} /></Link>
          <Link to='/dashboard' style={{color:'black', textDecoration:'none'}}><h3>Consult</h3></Link>
        </div>
      </header>
      <div className='profile'>
          <form className='profile-items' onSubmit={updateProfile}>
            {/* <div className='p-items p-image'>
              <input className='image-int' type='file' disabled={!isEditable} onChange={e => setImage(e.target.files[0])}></input> 
            </div> */}
            <div className='p-items'>
              <label>Name</label>
              <input className='name-int' placeholder="name" value={name}></input> 
            </div>
           <div className='p-items'>
            <label>Email</label>
            <input className='email-int' placeholder='email' value={email}></input>
           </div>
           <div className='p-items'>
            <label>Mobile</label>
            <input className='mobile-int' placeholder='mobile' value={mobile} disabled={!isEditable}  onChange={(e)=>{setMobile(e.target.value)}}></input>
           </div>
           <div className='p-items'>
            <label>Address</label>
            <textarea className='address-int' placeholder='address' value={address} disabled={!isEditable}  onChange={(e)=>{setAddress(e.target.value)}}></textarea>
           </div>
          <div>
            <Button type="button" onClick={handleEditClick} variant='contained'>Edit</Button>
            <Button type="submit" variant='contained' color='success'>Save</Button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Profile