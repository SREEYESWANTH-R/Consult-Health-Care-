const nodeMailer = require('nodemailer');

const sendMail = (req,res)=>{
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
  
  }

module.exports = sendMail;