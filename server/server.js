const express = require("express");
const mysql = require("mysql2");
const bcrypt = require('bcrypt')
const cors = require('cors');
const multer = require('multer');
const path = require('path')
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const { request } = require("http");


dotenv.config()

//app
const app = express();
app.use(cookieParser());
app.use(cors({
  origin:["http://localhost:3001"],
  methods:['POST','GET','UPDATE','DELETE','PUT'],
  credentials:true
}));

//middleware
app.use(express.json());
const Port = 3000;

// mutler to uplaod images 
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, "images" )
  },
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+ '_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage:storage
})

//use express to provide with static files 
app.use('/images', express.static(path.join(__dirname, 'images')));


//Cookie auth path 
const verifyToken = async (req,res,next)=>{
  //req token from cookies of the user
  const token = req.cookies.accessToken;
  //check if token is provided
  if(!token) return res.status(401).json({success:'false',message:'Session ended, login again'});
  //verify the token to get the user id
  try {
    // Verify the token to get the user id
    const decoded = jwt.verify(token, process.env.MY_PRIVATE_KEY);
    req.userId = decoded.Id;
    next(); // Pass control to the next middleware
  } catch (err) {
    // If the token is expired or invalid, update the user's active state to 0 (inactive)
    const userId = jwt.decode(token)?.Id; // Decode the token to get the user id
    if (userId) {
      const updateQuery = "UPDATE signup SET active = 0 WHERE id = ?";
      db.query(updateQuery, [userId], (error) => {
        if (error) {
          console.error('Error updating user active status:', error);
        }
      });
    }
    // Clear the token cookie and redirect the user to the login page
    res.clearCookie('accessToken');
    return res.status(401).json({ success: false, message: 'Session ended, login again' });
  }
};


//database connection 
const db = mysql.createConnection(
    {
        host:process.env.HOST,
        user:process.env.USER,
        password:process.env.USER_PASS,
        database:process.env.DATABASE
    }
)

//Route for signup
app.post("/signup",async(req,res)=>{
    const{Name,Email,Password} = req.body;
    //hashing the password 
    const hassPass = await bcrypt.hash(Password,10);
    const user = {Name,Email,Password:hassPass};
    //Insert the data to signup table with hashed password
    db.query("INSERT INTO signup SET ?",user,
    (err, result) => {
        if (err) {
            console.error('Error occurred during registration:', err);
            res.status(500).json({ error: 'Error occurred during registration' });
        } 
        else {
            console.log('User registered successfully');
            res.status(200).json({ message: 'User registered successfully' }); 
        }
    }
    )
});


//Route for Login
app.post("/login", (req, res) => {
  const { Email,password} = req.body;
  db.query(
    "SELECT * FROM signup WHERE email = ?",[Email],(err, result) => {
      if (err){
        console.error('Error executing query:', err);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
      }
      if (result.length > 0){
          const user = result[0];
          //comparing password with the signin password
          bcrypt.compare(password.toString(),user.password,(err)=>{
            if(err){
              return res.json({status:"Wrong Email or password"});
            } else{
              const accessToken =  jwt.sign({Id:user.id,name:user.name},process.env.MY_PRIVATE_KEY,{expiresIn:'1hr'});
              
              res.cookie("accessToken",accessToken,{
                httpOnly: true, // The cookie is inaccessible to JavaScript's `document.cookie`
                secure: true,   // Set to true if you're using HTTPS
                sameSite: 'Lax', // Prevents CSRF attacks
              });
              
              const updateSql = "UPDATE signup SET active = ? WHERE id = ?";
              //updating the column active in signup from false to true if password is correct 
              db.query(updateSql,[true,user.id],(err,response)=>{
                if(err) res.status(500).json({Error:"Error updating the active of signup"});
                res.status(200).json({message:"Login successful",name:user.name,Id:user.id});
              });
            }
            });
      }else{
        res.status(500).json("Login failed"); 
      }
  });
});

//Router to change password
app.put('/change-password',(req,res)=>{
  const { oldPass,newPass,passChangeEmail} = req.body;
  db.query("Select password from signup Where email= ?",[passChangeEmail],(err,result)=>{
    if(err) res.status(400).json({message:"Wrong Email"});
    if(result.length > 0){
      const user = result[0];
      console.log(user);
      bcrypt.compare(oldPass.toString(),user.password,async(err,result)=>{
        if(err){
          res.status(400).json({success:false,message:'Wrong Password'});
        }else{
          console.log(result);
          const newHashPAss = await bcrypt.hash(newPass,10);
          db.query("UPDATE signup SET password = ? WHERE email = ?",[newHashPAss,passChangeEmail],(err)=>{
            if(err) {
              res.status(400).json("Incorrect Credentials");
            }else{
              res.status(200).json({success:true,message:'Password Changed successfully'});
            }
          });
        }
      });
    }
  });
});


//Route for admin analatics
 app.get("/analytics",(req,res)=>{
    const query =  `
    SELECT 
      (SELECT COUNT(*) FROM signup WHERE active = 1) AS ActiveCount,
      (SELECT COUNT(*) FROM appointment) AS AppointmentCount,
      (SELECT COUNT(*) FROM doctor) AS DoctorCount
  `;
    db.query(query,(err,result)=>{
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Error fetching analytics data");
      } else {
        
        res.json(result[0]); // Sends the active count as JSON
      }
    });
 });

//Route for logout
app.post('/logout',verifyToken,(req,res)=>{
    const userId  = req.userId; 
    //query to update the active status of user to false
    const updateQuery = "UPDATE signup SET active = ? WHERE id = ?";
    db.query(updateQuery,[false,userId],(err,uptResult)=>{
      if(err) return res.status(500).json({Error:'Error updating the active status'});

      res.clearCookie("accessToken");
      res.status(200).json({success:true,message:'Logout Successful'});
      
    });
  });


//Route for Dashboard
app.get('/userData',verifyToken,(req, res) => {
  db.query('SELECT name FROM signup WHERE id = ?',[req.userId] ,(error, results) => {
    if (error) {
      console.error('Error fetching user name:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length > 0) {
      const username = results[0].name;
      const userId = req.userId;
      
      res.status(200).json({ success: true, username: username ,Id: userId});
    } else {
      res.status(404).json({ success: false, message: 'Username not found.' });
    }
  });
});

//Route to dialy the profile details
app.get(`/profile/:id`,(req,res)=>{
  const id = req.params.id;
  const profileSql = `
  select s.name,s.email,p.mobile,p.address 
  from signup s left join profile p on p.user_id = s.id 
  WHERE s.id = ?`;

  db.query(profileSql,[id],(err,result)=>{
    if(err) return res.status(401).json({success:false,message:"Error Fetching user details"});
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No User Found" });
    }
    return res.status(200).json({success:true,message:'User Data Fetched successfully',result});
  });
});


//Route for updating profile of user 
app.put(`/uptprofile/:id`,(req,res)=>{
  const {Mobile,Address} = req.body;
  const User_id = req.params.id;
  const updateProfile = `
  INSERT INTO profile (user_id, mobile, address)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE mobile = VALUES(mobile), address = VALUES(address)
`;

  db.query(updateProfile,[User_id,Mobile,Address],(err,uptRes)=>{
    if(err) return res.status(500).json("Error Updating Profile");
    return res.status(200).json({success:false, message:"Successful" , uptRes})
  });
});


//Route for Booking appoinment
app.post('/appoinment',(req,res)=>{
  const{name,age,gender,mobile,address,chooseDoc,date} = req.body;
  const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;

  const query = "INSERT INTO appointment (name,doctor,age,gender,mobNum,address,date) VALUES (?,?,?,?,?,?,?)";
  db.query(query,[name,chooseDoc,age,gender,formattedMobile,address,date],(err,result)=>{
    if(err){
      console.error("Error fetching appoinment data",err);
      res.status(500).json({error:"Error inserting data"});
    }else{
      console.log("Appoinment made successfully");
      res.status(200).json({ message: 'Appoinment made  successfully'});
      }
  });
});

//Route to send mobile notification upon successfull Appoinment 
// app.post('/notify-mobile', (req, res) => {
//   const { name, date, mobile } = req.body;
//   const mobileMessage = `Thank you ${name},\n Your Appointment is booked successfully on ${date}`;

//   fast2sms.sendMessage(
//     {
//       authorization: process.env.FASTTWO_SMS_API_KEY,
//       message: mobileMessage,
//       numbers: [mobile],
//     },
//     (error, response) => {
//       if (error) {
//         console.error('Error sending SMS notification:', error);
//         return res.status(500).json({ error: 'Error sending SMS notification' });
//       }

//       console.log('Fast2SMS API response:', response); // Log the response for debugging
//       if (response && response.return) {
//         res.status(200).json({ message: 'Appointment notification sent successfully', response });
//       } else {
//         res.status(500).json({ error: 'Failed to send notification', response });
//       }
//     }
//   );
// });


//Route to send mail to admin regarding the appoinmaent
app.post('/notify-admin',(req,res)=>{
  const{name,age,mobile,address,chooseDoc,date} = req.body;
  const transporter = nodeMailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.USER_MAIL,
      pass:process.env.USER_MAIL_PASS
    }
  })
  //email options

  const emailOptions = {
    from:process.env.USER_MAIL,
    to:process.env.ADMIN_MAIL,
    subject:'Booking Details',
    text:`NEW BOOKING DETAILS:
    \nNAME : ${name}
    \nAGE :${age}
    \nMOBILE: ${mobile}
    \nADDRESS : ${address}
    \nDOCTOR APPOINTED : ${chooseDoc}
    \nDATE OF APPOINMENT  : ${date}
    \nTHANK YOU ${name} FOR MAKING AN APPOINMENT`
  };

  transporter.sendMail(emailOptions,(err,info)=>{
    if(err)  res.status(401).json({success:false,message:'Admin not Notified Yet!!'});
    return res.status(200).json({success:true,message:"Admin Notified"});
  })

});


 
//Route to update appoinment
app.post('/appoinment/update',(req,res)=>{
  const { id,active} = req.body;
  db.query("UPDATE appointment SET active = ? WHERE id = ?",[active,id],(err,result)=>{
    if(err) res.status(500).json({message:"update unsuccessfull"});
    res.status(200).json({message:'Updated Successfully'});
  });
});

//Route to delete appoinment - admin 
app.post('/admin/appointment/delete', (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM appointment WHERE id = ?";
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting appointment", err);
      res.status(500).json({ error: "Error deleting appointment" });
      return;
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  });
});

//Route Admin Dashboard
app.get("/admin/dashboard",(req,res)=>{
  const query = "SELECT * FROM appointment"
  db.query(query,(error,result)=>{
    if(error){
      console.error("Error fetching Details of Appoinment",error);
      res.status(500).json({error:"Error fetching appoinment details"});  
    }
    res.status(200).json(result);

  });
});


//Route Admin Login
app.post('/adminlogin',(req,res)=>{
  const {adminName,adPassword} = req.body;
  const query = "SELECT adminname from adminLog WHERE adminname = ? AND Password = ? ";
  db.query(query,
    [adminName, adPassword],
    (err,results) =>{
      if(err){
        console.error("Error fetching username",err);
        res.status(500).send("Internal Serverr Error");
      }
      if(results.length === 1){
        const adName = results[0].adminname;
        return res.status(200).json({ success: true, adName });
      }else{
        return res.status(401).json({success:false,message:"Invalid Credentials"});
      }
    }
  );
});

//Route Add Doctors - ADMIN
app.post('/addDoctor', upload.single('image'), (req, res) => {
  const { name, gender, location, description, expertise } = req.body;
  const image = req.file.filename;

  const query = "INSERT INTO doctor (name, gender, location, description, expertise, image) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [name, gender, location, description, expertise, image], (err, result) => {
      if (err) {
          console.error("Error inserting doctor data", err);
          res.status(500).json({ error: "Error inserting data" });
      } else {
          console.log("Doctor inserted successfully");
          res.status(200).json({ message: 'Doctor inserted successfully' });
      }
  });
});

//Route to Display Doctors
app.get('/dashboard/doctors',(req,res)=>{
  const query = 'SELECT * FROM doctor'
  db.query(query,(error, result)=>{
    if(error){
      console.error("Error fetching Details of Appoinment",error);
      res.status(504).json({error:"Error fetching doctor data"})
      return
    }
    res.status(200).json(result);
  })
});

//Route to display Doctor details
app.get(`/dashboard/docdetails/:id`,(req,res)=>{
  const {id} = req.params;
  const detailSql = 'SELECT * FROM doctor WHERE id = ?';
  db.query(detailSql,[id],(err,result)=>{
    if(err) return res.status(401).json({success:false,message:"Failed to fetch doctors data"});
    res.status(200).json({success:true,message:'Data fetched successfully', result});
  });
});

//Route to delete Doctor
app.delete("/delete-doctor/:DocId",(req,res)=>{
  const {DocId} = req.params;
  db.query('DELETE FROM doctor WHERE id = ?',[DocId],(err)=>{
    if(err){res.status(400).json({success:false,message:'Id Not defined'})}
    res.status(200).json({Success:'true',message:'Doctor detail deleted successfully'})
  })
})

//Route To edit doctors 
app.put("/edit-doctor/:id", upload.single('image'), (req, res) => {
  const doctorId = req.params.id;
  const { location, description } = req.body;
  const image = req.file ? req.file.filename : null;

  // console.log("Request body:", req.body);
  // console.log("Uploaded file:", req.file);
  
  if (!location || !description) {
    return res.status(400).json({ error: "Location and description are required" });
  }

  const sqlQuery = `
    UPDATE doctor
    SET location = ?, description = ?, image = ? 
    WHERE id = ?`;

  db.query(sqlQuery, [location, description, image, doctorId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error updating doctor details" });
    }
    res.status(200).json({ message: "Doctor details updated successfully" });
  });
});


//Route to get Drugs from the table
app.get('/api/drugs',(req,res)=>{
  db.query("SELECT * FROM Drugs",(err,result)=>{
    if(err) {res.status(400).json("Error Fetching Drug Details");}
    else{
      res.status(200).json(result);
    }
  })
})

app.put("/add/cart",verifyToken,async(req,res)=>{
  const{drug_id,cost,quantity} = req.body;
  const userId = req.userId
  // const sql = "INSERT INTO Cart ( drug_id, quantity, cost, userId) VALUES (?, ?, ?, ?)";
  // 
  try{
   const [rows] = await db.promise().query(
    "SELECT cost, quantity FROM Cart WHERE drug_id = ? AND userId = ?",
    [drug_id,userId]
   )
   if(rows.length > 0){
     const currQuantity = rows[0].quantity
     const curCost = parseFloat(rows[0].cost)

     const newQuantity = currQuantity + quantity;
     const newCost = curCost + parseFloat(cost);

     await db.promise().query("UPDATE Cart SET quantity = ?, cost = ? WHERE drug_id = ? AND userId = ?",
      [newQuantity,newCost,drug_id,userId]
     );
   }else{
    const sql = "INSERT INTO Cart ( drug_id, quantity, cost, userId) VALUES (?, ?, ?, ?)"
    const values = [ drug_id,quantity,cost,userId];
    await db.promise().query(sql,values);
   }
   res.status(200).send({ message: 'Drug added to cart successfully' });
  }catch(error){
    console.error('Error adding drug to cart:', error);
    res.status(500).send({ message: 'Failed to add drug to cart' });
  }
});

app.get("/cart-details",(req,res)=>{
  db.query(`
    select c.prescription_id,c.quantity , c.cost, d.name from Cart c join Drugs d on c.drug_id = d.drug_id;`,(err,cartRes)=>{
      if(err){
        res.status(400).json("Error getting cart details")
      }else{
        res.status(200).json({success:true,message:'details Fetched successfully',cartRes})
      }
    })
})

app.listen(Port,()=>{
    console.log(`Server running on PORT ${Port}`)
})