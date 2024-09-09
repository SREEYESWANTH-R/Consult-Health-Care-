import React,{useEffect, useState} from 'react'
import './AddDoc.css'
import { Button, TextField,Input,Snackbar,Alert,Typography,Card,CardContent,Modal} from '@mui/material';
import axios from 'axios'
import { EditNote, Delete} from '@mui/icons-material';


function AddDoc(){

const [name,setName] = useState('');
const [gender,setGender] = useState('')
const [location,setLocation] = useState('')
const [expertise,setExpertise] = useState('')
const [description,setDesc] = useState('')
const [image,setImage] = useState();
const [openSnackBar, setOpenSnackBar] = useState(false);
const [doctor,setDoc] = useState([]);

 
const handleClose = ()=>{
  setOpenSnackBar(false)
}


 function docDetails(event){
        event.preventDefault()
        const formData = new FormData();
        formData.append('name', name);
        formData.append('gender', gender);
        formData.append('location', location);
        formData.append('description', description);
        formData.append('expertise', expertise);
        formData.append('image', image);

        axios.post("http://localhost:3000/addDoctor", formData, {
        headers: {
                'Content-Type': 'multipart/form-data',
        },
        })
        .then(response => {
        setOpenSnackBar(true);
        setTimeout(()=>{
          setName("");
          setGender('');
          setLocation('');
          setExpertise('');
          setDesc('')
          setImage('');
        },3000)
        }).catch(error => {
        console.error("Error posting data of Doctor", error);
        });
}

const fetchDoctors = () =>{
  axios.get("http://localhost:3000/dashboard/doctors")
  .then((response)=>{
    setDoc(response.data);
  }).catch((error)=>{
    console.error("Empty set Doctor",error)
  })
}

  useEffect(()=>{
    fetchDoctors()
  },[])

  const handleDelete = (DocId) =>{
    axios.delete(`http://localhost:3000/delete-doctor/${DocId}`)
    .then(()=>{
      alert("doctor deleted")
    }).catch((error)=>{
      console.log(error);
    })
  }

  const handleEdit = () =>{

  }
 
  return (
    <div className='AddDoc-Container'>
      <div className='AddDoc-Details'>
        <h1>Doctors Addition</h1>
          <form onSubmit={docDetails}>
            <TextField
              required
              fullWidth
              id="outlined-basic"
              label="Name"
              value={name}
              variant="outlined"
              onChange={e => setName(e.target.value)}
              style={{marginBottom:'10px'}}
            />
            <TextField
              required
              fullWidth
              id="outlined-basic"
              label="Gender"
              value={gender}
              variant="outlined"
              onChange={e => setGender(e.target.value)}
              style={{marginBottom:'10px'}}
            />
            <TextField
              required
              fullWidth
              id="outlined-basic"
              label="Location"
              value={location}
              variant="outlined"
              onChange={e => setLocation(e.target.value)}
              style={{marginBottom:'10px'}}
            />
            <TextField
              required
              fullWidth
              id="outlined-basic"
              label="Description"
              value={description}
              variant="outlined"
              onChange={e => setDesc(e.target.value)}
              style={{marginBottom:'10px'}}
            />
            <TextField
              required
              fullWidth
              id="outlined-basic"
              label="Expertise"
              value={expertise}
              variant="outlined"
              onChange={e => setExpertise(e.target.value)}
              style={{marginBottom:'10px'}}
            />
            <Input
              required
              fullWidth
              type='file'
              onChange={e => setImage(e.target.files[0])}
              style={{marginBottom:'10px'}}
            />
          <Button variant="contained" style={{ backgroundColor: 'blue' }} type="submit">Submit</Button>
          <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: '100%' }}
            >
              Doctor Inserted Successfully!
            </Alert>
          </Snackbar>
        </form>
      </div>

      {/* To display the doctors and edit or delete them accordingly */}
      <div style={{display:'flex', flexWrap:'wrap', gap: '16px', justifyContent:'center' }}>
        {doctor && doctor.length > 0 ? (
          (doctor.map((doc) => (
            <Card key={doc.id} style={{ width: '340px', margin: '10px'}}>
              <CardContent style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Typography variant="h6" component="div">
                  {doc.name}
                </Typography>
                <div>
                  <EditNote onClick={handleEdit}></EditNote>
                  <Delete onClick={()=>{handleDelete(doc.id)}}></Delete>
                </div>
              </CardContent>
            </Card>
          )))
        ):(
          <Typography variant="body2" color="textSecondary">
              No Doctors Found!!
          </Typography>
        )}
      </div>


    </div>
  )
}

export default AddDoc   