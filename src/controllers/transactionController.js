
const Transaction = require("../models/Transaction");

exports.add = async (req,res)=>res.json(await Transaction.create(req.body));

exports.list = async (req,res)=>{
  const q={};
  if(req.query.category) q.category=req.query.category;
  if(req.query.division) q.division=req.query.division;
  if(req.query.start && req.query.end)
    q.createdAt={$gte:new Date(req.query.start),$lte:new Date(req.query.end)};
  res.json(await Transaction.find(q).sort({createdAt:-1}));
};

exports.edit = async (req,res)=>{
  const t=await Transaction.findById(req.params.id);
  if(!t) return res.sendStatus(404);
  const hrs=(Date.now()-new Date(t.createdAt))/(1000*60*60);
  if(hrs>12) return res.status(403).json({message:"Edit restricted"});
  Object.assign(t,req.body);
  await t.save();
  res.json(t);
};
