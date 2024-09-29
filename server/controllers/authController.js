const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { Name, Email, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = { Name, Email, Password: hashedPassword };

    db.query("INSERT INTO signup SET ?", user, (err) => {
        if (err) {
            console.error('Error occurred during registration:', err);
            return res.status(500).json({ error: 'Error occurred during registration' });
        }
        res.status(200).json({ message: 'User registered successfully' });
    });
};

exports.login = (req, res) => {
    const { Email, password } = req.body;
    db.query("SELECT * FROM signup WHERE email = ?", [Email], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
        }

        if (result.length > 0) {
            const user = result[0];
            bcrypt.compare(password.toString(), user.password, (err) => {
                if (err) return res.json({ status: "Wrong Email or password" });

                const accessToken = jwt.sign({ Id: user.id, name: user.name }, process.env.MY_PRIVATE_KEY, { expiresIn: '1hr' });
                res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'Lax' });
                res.status(200).json({ message: "Login successful", name: user.name, Id: user.id });
            });
        } else {
            res.status(500).json("Login failed");
        }
    });
};

exports.adminLogin = (req,res)=>{
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
  
  exports.logout = (req,res)=>{
    const userId  = req.userId; 
    //query to update the active status of user to false
    const updateQuery = "UPDATE signup SET active = ? WHERE id = ?";
    db.query(updateQuery,[false,userId],(err,uptResult)=>{
      if(err) return res.status(500).json({Error:'Error updating the active status'});

      res.clearCookie("accessToken");
      res.status(200).json({success:true,message:'Logout Successful'});
      
    });
  };

  exports.passChange = (req,res)=>{
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
  };