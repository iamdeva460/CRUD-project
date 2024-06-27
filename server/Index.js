const cors =require('cors');
const express = require('express');
const users =require('./sample.json');
const fs =require('fs')

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' ,
             methods:['GET','POST','PATCH','DELETE']
}));

//display all users
app.get('/users',(req,res)=>{
     return res.json(users)
})

//delete userDetail
app.delete('/users/:id',(req,res)=>{
     let id = Number(req.params.id);
     let filteredUsers = users.filter((user)=> user.id !== id);
  fs.writeFile('./sample.json',JSON.stringify(filteredUsers),(err ,data)=>{
     return res.json(filteredUsers)
  })   
})

//Add New USER
app.post('/users',(req,res)=>{
  let {name , age , city } = req.body;
  if(!name || !age || !city){
     res.status(404).send({message:"All Feilds Are Required"})
  }   
  let id =Date.now()
  users.push({id,name,age,city})
  fs.writeFile('./sample.json',JSON.stringify(users),(err ,data)=>{
   return res.json({ message : "User Detail Added Successfully"})  
})  
     
})
//UPDATE USER
app.patch('/users/:id',(req,res)=>{
   let id = Number(req.params.id);
   let {name , age , city } = req.body;
   if(!name || !age || !city){
      res.status(404).send({message:"All Feilds Are Required"})
   }   
   let index = users.findIndex((user)=>user.id == id );
  users.splice(index,1,{...req.body});
   fs.writeFile('./sample.json',JSON.stringify(users),(err ,data)=>{
    return res.json({ message : "User Detail Updated Successfully"})  
 })  
      
 })
 


app.listen(port,(error)=>{
     console.log(`app is running in port ${port}`);
});