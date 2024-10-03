const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path')
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appoinmentRoutes = require('./routes/appoinmentRoutes');
const DrugRoutes = require('./routes/DrugRoutes');
const emailRoutes = require('./routes/emailRoutes');
const profileRoutes = require('./routes/profileRoutes');

require('./config/dotenv');

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

//use express to provide with static files 
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth',authRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/appoinments',appoinmentRoutes);
app.use('/api/profiles',profileRoutes);
app.use('/api/drug',DrugRoutes);
app.use('/api/email',emailRoutes);
app.use('/api/doctor',doctorRoutes);


app.listen(Port,()=>{
  console.log(`Server running on PORT ${Port}`)
})

