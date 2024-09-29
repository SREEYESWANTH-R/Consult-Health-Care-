const db = require('../config/db');


exports.userData = (req, res) => {
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
  };


exports.adminDashboard = (req,res)=>{
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
  };


exports.analytics = (req,res)=>{
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
 };