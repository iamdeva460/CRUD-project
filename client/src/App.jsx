import { useState,useEffect } from 'react'

import './App.css';

import axios from 'axios';


function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers ,setFilterUsers]=useState([]);
  const [isModelOpen,setIsModelOpen]=useState(false);
  const [userData , setUserData] = useState({name:'',age:'',city:''});

  
  
  //deleteFunction
  const  handleDelete =async(id)=>{
    const isConfirmed = window.confirm('Are You Sure You Want To Delete This User');
    if(isConfirmed){ await axios.delete(`http://localhost:5000/users/${id}`).then((res)=>{
      setUsers(res.data);
      setFilterUsers(res.data)
    
         })}
  }
  //closeModel
 const  closeModel=()=>{
   setIsModelOpen(false)
   
 }

//Add User Details
const handleAddRecord =()=>{
 setUserData({name:'',age:'',city:''});
  setIsModelOpen(true)
}
const handleData=(e)=>{
   setUserData({...userData,[e.target.name]:e.target.value});
}
const handleSubmit =async (e)=> {
 e.preventDefault();

 if(userData.id){
  await axios.patch(`http://localhost:5000/users/${userData.id}`,userData)
  .then((res)=>{console.log(res);
   
  })
 }else{
  await axios.post('http://localhost:5000/users',userData)
  .then((res)=>{console.log(res);
   
  })
 }
 closeModel();

}

const getAllUsers = async() =>{

await axios.get('http://localhost:5000/users')
.then((res)=> {
  console.log(res.data)
  setUsers(res.data);
   setFilterUsers(res.data);

});

  }

  useEffect(()=>{
getAllUsers();

  },[]);

  //searchFunction
  const handleSearchChange=(e)=>{
    const searchText = e.target.value.toLowerCase();
    const filteredUser = users.filter((user)=>user.name.toLowerCase().includes(searchText) ||
    user.city.toLowerCase().includes(searchText));
    setFilterUsers(filteredUser)

  }
  //edit function
const handleUpdateRecord=(user)=>{
  
  setIsModelOpen(true);
  setUserData(user);
  

}

  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.JS Frontend and Node.js Backend</h3>
        <div className="input-search">
          <input type='search' placeholder='Search Text Here..' onChange={handleSearchChange}/>
          <button className='btn light-green' onClick={handleAddRecord}>Add Record</button>
        </div> 
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>          
          </thead>
          <tbody>
             {filterUsers && filterUsers.map((user,index)=>{
              return(
               <tr key={user.id}>
               <td>{user.id}</td>
               <td>{user.name}</td>
               <td>{user.age}</td>
               <td>{user.city}</td>
               <td><button className='btn green' onClick={()=>handleUpdateRecord(user)}>edit</button></td>
               <td><button className='btn red' onClick={()=>{handleDelete(user.id)}} >delete</button></td>
             </tr>)
             })}

             
            </tbody>
        </table>
       {isModelOpen && (
        <div className='model'>
            <div className='model-content'> 
              <span className='close' onClick={closeModel}>&times;</span>
              <h2>{userData.id ? 'Update Record':'New Record' }</h2>
          <div className="input-group">
            <label htmlFor='name'>Full Name</label>
            <input type='text' value={userData.name} id='name' onChange={handleData} name='name'/>
          </div>
      <div className="input-group">
        <label htmlFor='age' >Age</label>
        <input type='number'  value={userData.age} id='age' onChange={handleData} name='age'/>
      </div>
          <div className="input-group">
            <label htmlFor='city' >City</label>
            <input type='text'  value={userData.city} id='city' onChange={handleData} name='city'/>
          </div>
           <button className='addbtn btn green' onClick={handleSubmit}>{userData.id ? 'Update Record':'Add Users' } </button>
            </div>
         </div>
       )}
      </div>
      
    </>
  )
}

export default App
