
const Account=require("../models/Account");
exports.transfer=async(req,res)=>{
  const {from,to,amount}=req.body;
  const a=await Account.findOne({name:from});
  const b=await Account.findOne({name:to});
  if(!a||!b) return res.sendStatus(404);
  a.balance-=amount; b.balance+=amount;
  await a.save(); await b.save();
  res.json({message:"Transfer success"});
};
