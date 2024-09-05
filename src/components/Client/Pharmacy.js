import React,{useEffect, useState} from 'react';
import { Link} from 'react-router-dom';
import { Card, CardContent, Typography ,Button} from '@mui/material';
import {LocalHospital,AccountCircle, ShoppingCartCheckoutOutlined} from '@mui/icons-material'
import './Pharmacy.css'
import { CardActions } from '@mui/joy';
import axios from 'axios';

const Pharmacy = () => {
    const [drugName, setDrugName] = useState("");
    const [drugs,setDrugs] = useState([]);
    
    const fetchDrugs = async() =>{
        try{
            const response = await axios.get('http://localhost:3000/api/drugs');
            if(response.status === 200){
                setDrugs(response.data);
            }
        }catch(error){
            console.log("Error:",error);
        }
    }

    const searchDrugs = ()=>{
        const result = drugs.filter(drug => 
            drug.name.toLowerCase().includes(drugName.toLowerCase())
        );
        setDrugs(result);
    }

    const handleCart = async(drug)=>{
        try {
            const response = await axios.put('http://localhost:3000/add/cart', {
                drug_id: drug.drug_id,
                cost: drug.cost,
                quantity: 1
            });
            if (response.status === 200) {
                console.log("Drug added to cart successfully!");
            } else {
                alert("Failed to add drug to cart.");
            }
        } catch (error) {
            alert("An error occurred while adding the drug to the cart.");
        }
    }

    useEffect(()=>{
        fetchDrugs();
    },[])

    return (
        <div>
             <header className='dash-head' style={{fontFamily:'Poppins'}}>
                <div className='dash-logo'>
                <LocalHospital fontSize='large' style={{ color: 'blue'}} />
                <Link to='/dashboard' style={{color:'black', textDecoration:'none'}}><h3>Consult</h3></Link>
                </div>
                <div>
                <div className='pharmacy-nav'>
                    <AccountCircle fontSize='medium'/> 
                    <Link to='/billing' style={{textDecoration:'none', color:'black'}}><ShoppingCartCheckoutOutlined fontSize='medium'/></Link>
                </div>
                </div>
            </header>
            <div className='Search-tablet'>
                <input placeholder='Enter Tablet Name' type='text' value={drugName} onChange={e=>{setDrugName(e.target.value)}}/>
                <Button onClick={searchDrugs}>Search</Button>
            </div>
            <div className='heading'>
                <h3>Tables For You..</h3>
                <hr></hr>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent:'center' }}>
                
            {drugs && drugs.length > 0 ?(
                drugs.map((drug) => (
                <Card key={drug.id} style={{ width: '300px', margin: '10px'}}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {drug.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Brand: {drug.brand}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Generic: {drug.generic}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Dosage Form: {drug.dosageForm}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Strength: {drug.strength}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Route: {drug.route}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Description: {drug.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Cost: {drug.cost}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" style={{ backgroundColor: 'blue' }} type='submit' onClick={() => handleCart(drug)}> Add To Cart</Button>
                    </CardActions>
                </Card>
                ))
            ):(
                <Typography variant="body2" color="textSecondary">
                    No drugs available.
                </Typography>
            )}
        </div>
  </div>
    );
};

export default Pharmacy;
