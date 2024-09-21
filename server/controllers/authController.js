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
  