// DocDetail.js
import React, { useEffect, useState } from 'react';
import '../Client/DocDetail.css';
import {LocationOn,MedicalInformation,Man,Woman} from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DocDetail() {
  const {id} = useParams();
  const [doctor,setDoctor]  = useState([]);

  const fetchDocDetails = async()=>{
    try{
      const response  = await axios.get(`http://localhost:3000/dashboard/docdetails/${id}`);
      setDoctor(response.data.result[0]);
    }catch(error){
      console.error("Error displaying the details of the Doctor's",error);
    };
  };

  useEffect(()=>{
    fetchDocDetails();
  },[id]);

  return (
<div className='details-container'>
      {doctor ? (
        <div className='doctors'>
          <div className='doc-img'>
            <img src={`../../../server/images/${doctor.image}`} alt={doctor.name} />
          </div>
          <div className='doc-LE'>
            <h5><MedicalInformation />{doctor.expertise}</h5>
            <h5>
              {doctor.gender === 'Male' ? <Man /> : <Woman />}
              {doctor.gender}
            </h5>
            <h5><LocationOn />{doctor.location}</h5>
          </div>
          <div className='des-frame'>
            {doctor.description}
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default DocDetail;
