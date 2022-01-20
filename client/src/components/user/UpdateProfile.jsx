import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
function UpdateProfile(){
             const [email, setEmail] = useState('');
             const [photo, setPhoto] = useState('');
             // const [users, setUsers] = useState(''); 
              const [online, setOnline] = useState('');
             const {username} = useParams();


    useEffect(()=>{

        axios.get('/api/user/'+username)
        .then(res=>{
            console.log(res.data)
            setPhoto(res.data.photo)
            setEmail(res.data.email)
        })
        .catch(err=>{
            console.log(err.response)
        });

       /* axios.get('/api/users')
        .then(res=>{
            console.log(res.data)
            let users = res.data
           setUsers(users)
        })

        .catch(err=>{
            console.log(err.response)
        });*/

        axios.get('/api/online-users')
        .then(res=>{
            console.log(res.data)
            setOnline(res.data)
        })
        .catch(err=>console.log(err.response))
  

    }, [username]);




    let handleLogout = (username) =>{
        console.log(username)
        axios.delete('/api/delete/online-user/'+username)
        .then(res=>{
            console.log(res.data)
            let data = online.filter(isOnline=>isOnline.username!==username)
            console.log(data)
            setOnline(data);
            console.log(online)
        })
        .catch(err=>console.log(err.response))
        
        localStorage.removeItem('online');
       // window.location.href='/user/login';
    
    };





     let changeEmail=(e)=>{
         setEmail(e.target.value);
     };

     let changePhoto = (e) =>{
        if(maxSelectFile(e) && checkFileSize(e) && checkMimeType(e)){

         let photo = e.target.files[0];
         setPhoto(photo);
         console.log(photo)
        }
    } 


            
//upload image functions//

let maxSelectFile=(e)=>{
let file = e.target.files[0] // create file object
if (file.length > 1) { 
   const msg = 'Only 1 images can be uploaded at a time'
   toast.error('Only 1 images can be uploaded at a time')
   e.target.value = null // discard selected file
   console.log(msg)
  return false;

}
return true;

}


let checkMimeType=(e)=>{
//getting file object
let file = e.target.files[0]; 
//define message container
let err = ''
// list allow mime type
const types = ['image/png', 'image/jpg', 'image/jpeg']
// loop access array

// compare file type find doesn't matach
//eslint-disable-next-line
 if (types.every(type => file.type !== type)) {
 // create error message and assign to container   
 err += file.type+' is not a supported format\n';
 toast.error( file.type+' is not a supported format\n')
}


if (err !== '') { // if message not same old that mean has error 
e.target.value = null // discard selected file
console.log(err)
 return false; 
}
return true;

}

let checkFileSize=(e)=>{
let file = e.target.files[0];
let size = 1000000  //1mb 
let err = ""; 
if (file.size > size) {
err += file.type+'is too large, please pick a smaller file\n';
toast.error('Image is too large, please pick a smaller file')

};
if (err !== '') {
e.target.value = null
console.log(err)
return false
}

return true;

}

let onSubmit = (e) =>{
    e.preventDefault();
     let data = new FormData();

     data.append('photo', photo);
     console.log(photo);
     data.append('email', email);

     console.log(email); 

     


     
    if(!email){
        let err = 'You can not submit empty form';
        console.log(err);
        toast.error('You can not submit empty form');
        return false;
      }else{

        
      axios.put('/api/update/user/'+username, data)
      .then(res=>{
          console.log(res.data)
          setEmail(res.data.email);
          setPhoto(res.data.photo);
          if(res.data.isVerified === true){
            toast.success('Success, record updated');
            setTimeout(()=>{
                handleLogout();
             window.location.href='/user/login';
 
            }, 2000) 
          } else{
          toast.success('Success, verification code sent to your email');
           setTimeout(()=>{
            window.location.href='/user/verify-email';

           }, 2000) 
        }
        })

      .catch(err=>{
          console.log(err.response);
          toast.error('Oops! An error occur, try again')
      })

      return true;
    }
     

  }

                
    return(
           
        <div className="container-fluid login">
           <h5 className="pt-4 text-center text-white">Welcome to Discussion</h5>
           <p className="text-center text-white"> Hi! {username} Update your account record</p>
           <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={onSubmit}>
               <div className="form-group">
               <label className="text-white" >Email</label>

                   <input className="form-control login-control" type="email" placeholder="enter email" value={email} onChange={changeEmail} />
               </div>
                   <img className="img-thumbnail my-3 d-block mx-auto" style={{width: "150px", height:"150px"}} src={photo} alt=" "/>
               <div className="form-group mt-3">
               <label className="text-white" >Upload New Photo</label>

                   <input className="form-control login-control" type="file" placeholder="" defaultValue={photo} onChange={changePhoto}/>
               </div>
               <div className="form-group mt-3">
                   <button className="btn login-btn">Update Record</button>
               </div>
           </form>
           <div className="d-flex justify-content-between my-2 col-lg-6 mx-lg-auto">
           <Link className=" text-white login-link" to="/">Home</Link>

           <Link className=" text-white login-link " to="/user/profile">Profile</Link>

           </div>

        </div>
    )
}


export default UpdateProfile;