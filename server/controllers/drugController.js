const db = require('../config/db');

exports.drugs = (req,res)=>{
    db.query("SELECT * FROM Drugs",(err,result)=>{
      if(err) {res.status(400).json("Error Fetching Drug Details");}
      else{
        res.status(200).json(result);
      }
    })
  };

exports.addCart = async(req,res)=>{
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
  }

  exports.cartDetails = (req,res)=>{
    db.query(`
      select c.prescription_id,c.quantity , c.cost, d.name from Cart c join Drugs d on c.drug_id = d.drug_id;`,(err,cartRes)=>{
        if(err){
          res.status(400).json("Error getting cart details")
        }else{
          res.status(200).json({success:true,message:'details Fetched successfully',cartRes})
        }
      })
  };