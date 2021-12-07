const express=require('express')
const router=express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')

router.get('/new',(req,res)=>{
  res.render('users/new.ejs')
})

router.post('/create',async (req,res)=>{
  const name =  req.body.name
  const password =  await bcrypt.hash(req.body.password,10);
  await User.create({
    name,
    password
  })
  res.redirect('/')
})


module.exports=router;