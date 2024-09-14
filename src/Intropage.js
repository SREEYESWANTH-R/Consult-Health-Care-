import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Intropage.css';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Button from '@mui/material/Button';
import IntroSec from './assests/introSec.png';


function Intropage() {
  return (
    <div className='intro-container'>
      <header className='header'>
        <div className='logo-sec'>
          <LocalHospitalIcon fontSize='large' style={{ color: 'blue'}} />
          <h3>Consult</h3>
        </div>
        <ul className='nav'>
          {/* Use Link instead of anchor tag */}
          <li className='nav-item'><Button variant="contained" style={{ backgroundColor: 'blue'}}><Link className='link-a' to="/signup">SignIn</Link></Button></li>
          <li className='nav-item'><Button variant="contained" style={{ backgroundColor: 'blue'}}><Link className='link-a' to="/login">LogIn</Link></Button></li>
          <li className='nav-item'><Button variant="contained" style={{ backgroundColor: 'blue'}}><Link className='link-a' to="/adminlogin">Admin</Link></Button></li>
        </ul>
      </header>
      <div className='intro'>
        <div className='about-sec'>
          <h2>Consult Specialist Doctors Securely and Privately </h2>
          <p>Lorem Ipsum is simply dummy text of the printing
            and typesetting industry. Lorem Ipsum has been the 
            industry's standard dummy text ever since the 1500s
            , when an unknown printer took a galley of type 
            and scrambled it to make a type specimen book
          </p>
          <Button variant='contained' style={{ backgroundColor: 'blue'}}>SEE MORE</Button>
        </div>
        <div className='imgIntro-sec'>
          <img src={IntroSec} style={{width:'100%', height:'100%'}} alt="into-img"/>
        </div>
      </div>

      <div class="services-section">
        <h2>Our Services</h2>
        <div class="service-card">
          <h3>Consult with Doctors</h3>
          <p>Access a wide range of specialists for online consultations and medical advice.</p>
        </div>
        <div class="service-card">
          <h3>Book Appointments</h3>
          <p>Schedule appointments with your preferred doctors quickly and easily.</p>
        </div>
        <div class="service-card">
          <h3>Buy Tablets</h3>
          <p>Order medicines from our pharmacy and get them delivered to your doorstep.</p>
        </div>
      </div>


      <footer className='footer'>
        <div className='footer-container'>
          <div className='footer-about'>
            <h4>About Us</h4>
            <p>We provide secure and private consultations with specialist doctors online, ensuring you receive the care you need.</p>
          </div>
          <div className='footer-links'>
            <h4>Quick Links</h4>
            <ul>
              <li><Link className='footer-link' to="/signup">SignUp</Link></li>
              <li><Link className='footer-link' to="/login">Login</Link></li>
              <li><Link className='footer-link' to="/adminlogin">Admin</Link></li>
            </ul>
          </div>
          <div className='footer-contact'>
            <h4>Contact Us</h4>
            <p>Email: support@consult.com</p>
            <p>Phone: +123 456 7890</p>
            <div className='social-icons'>
              <a href='#'><i className='fab fa-facebook'></i></a>
              <a href='#'><i className='fab fa-instagram'></i></a>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <p>&copy; 2024 Consult. All rights reserved.</p>
        </div>
    </footer>

    </div>
  );
}

export default Intropage;
