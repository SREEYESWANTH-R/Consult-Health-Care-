import React,{useEffect, useState} from 'react';
import { Link} from 'react-router-dom';
import { Card, CardContent, Typography ,Button, Modal } from '@mui/material';
import {LocalHospital,AccountCircle, ShoppingCartCheckoutOutlined} from '@mui/icons-material'
import './Pharmacy.css'
import { ModalDialog, ModalClose,CardActions} from '@mui/joy';
import axios from 'axios';

const Pharmacy = () => {
    const [drugName, setDrugName] = useState("");
    const [drugs,setDrugs] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [cart,setCart] = useState([]);
    
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

    const handleModalOpen = () => {
        setOpenModal(true);
        fetchCart()
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const fetchCart = async()=>{
        try{
            const getCart = await axios.get("http://localhost:3000/cart-details");
            if(getCart){
                console.log(getCart)
                setCart(getCart.data.cartRes);
            }
        }catch(error){
            console.log("Error fetching details",error);
        }
    }

    useEffect(()=>{
        fetchDrugs();
    },[])

    return (
        <div>
             <header className='dash-head' style={{fontFamily:'Poppins'}}>
                <div className='dash-logo'>
                <Link to='/dashboard'><LocalHospital fontSize='large' style={{ color: 'blue'}} /></Link>
                <Link to='/dashboard' style={{color:'black', textDecoration:'none'}}><h3>Consult</h3></Link>
                </div>
                <div>
                <div className='pharmacy-nav'>
                    <AccountCircle fontSize='medium'/> 
                    <ShoppingCartCheckoutOutlined fontSize='medium' onClick={handleModalOpen} style={{ cursor: 'pointer' }} />

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

        <Modal open={openModal} onClose={handleModalClose}>
                <ModalDialog variant="solid" color='white' sx={{width:'50%',textAlign:'center'}} >
                    <ModalClose onClick={handleModalClose} />
                    <Typography id="modal-title" variant="h6" component="h2" color={'black'}>
                        Cart Details
                    </Typography>
                    {cart && cart.length > 0 ? (
                        cart.map((item) => (
                            <div key={item.precption_id} style={{display:"flex", justifyContent:"space-evenly",alignItems:"center"}}>
                                <Typography color={'black'}>
                                    {item.name}
                                </Typography>
                                <Typography color={'black'}>
                                    x {item.quantity}
                                </Typography>
                                <Typography color={'black'}>
                                    ₹{item.cost}
                                </Typography>
                                <hr />
                            </div>
                        ))
                   ):(
                    <Typography id="modal-description" color={'black'}>
                        Your cart is empty.
                    </Typography>
                   )}
                   <Button variant="contained" style={{ backgroundColor: 'green',width:'150px', margin:"auto "}} type='submit' >Order Now</Button>
                </ModalDialog>
            </Modal>

  </div>
    );
};

export default Pharmacy;
