const db = require('../config/db');


exports.profileDetails = (req,res)=>{
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
  };

exports.updateProfile = (req,res)=>{
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
};