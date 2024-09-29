const db = require('../config/db')



exports.addDoctor =  (req, res) => {
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
  }

exports.dashDoctor = (req,res)=>{
    const query = 'SELECT * FROM doctor'
    db.query(query,(error, result)=>{
      if(error){
        console.error("Error fetching Details of Appoinment",error);
        res.status(504).json({error:"Error fetching doctor data"})
        return
      }
      res.status(200).json(result);
    })
  };


exports.docDetails = (req,res)=>{
    const {DocId} = req.params;
    db.query('DELETE FROM doctor WHERE id = ?',[DocId],(err)=>{
      if(err){res.status(400).json({success:false,message:'Id Not defined'})}
      res.status(200).json({Success:'true',message:'Doctor detail deleted successfully'})
    })
  }

exports.editDoctor = (req, res) => {
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
  }

exports.deleteDoctor = (req,res)=>{
    const {DocId} = req.params;
    db.query('DELETE FROM doctor WHERE id = ?',[DocId],(err)=>{
      if(err){res.status(400).json({success:false,message:'Id Not defined'})}
      res.status(200).json({Success:'true',message:'Doctor detail deleted successfully'})
    })
  }