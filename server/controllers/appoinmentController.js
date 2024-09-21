const db = require('../config/db');

exports.appoinment = (req,res)=>{
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
    })
};

exports.appoinmentUpdate = (req,res)=>{
    const { id,active} = req.body;
    db.query("UPDATE appointment SET active = ? WHERE id = ?",[active,id],(err,result)=>{
      if(err) res.status(500).json({message:"update unsuccessfull"});
      res.status(200).json({message:'Updated Successfully'});
    });
  };

exports.adminAppDelete = (req, res) => {
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
  };