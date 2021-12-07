const express=require('express')
const router=express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')


router.get('/new',(req,res)=>{
  res.render('session/new.ejs')
})

router.post('/',async (req,res)=>{
  const user = await User.findOne({name: req.body.name});
  if(!user)
  {
      res.send("user not found")
  }
  const isValid = await bcrypt.compare(req.body.password,user.password);
  if(isValid){
    req.session.user=user 
    res.redirect('/')

  }else{
    res.send("Wrong password")
  }
})

router.delete("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});


module.exports=router;