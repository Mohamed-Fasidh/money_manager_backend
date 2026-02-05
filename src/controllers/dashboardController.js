
const Transaction=require("../models/Transaction");

async function summary(start,end){
  return Transaction.aggregate([
    {$match:{createdAt:{$gte:start,$lte:end}}},
    {$group:{_id:"$type",total:{$sum:"$amount"}}}
  ]);
}

exports.weekly=async(req,res)=>{
  const e=new Date(),s=new Date();s.setDate(e.getDate()-7);
  res.json(await summary(s,e));
};
exports.monthly=async(req,res)=>{
  const e=new Date(),s=new Date(e.getFullYear(),e.getMonth(),1);
  res.json(await summary(s,e));
};
exports.yearly=async(req,res)=>{
  const e=new Date(),s=new Date(e.getFullYear(),0,1);
  res.json(await summary(s,e));
};
