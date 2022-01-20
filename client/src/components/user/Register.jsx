import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';
function Register(){

           const [email, setEmail] = useState('');
           const [username, setUsername] = useState('');
           const [photo, setPhoto] = useState('');
           const [password, setPassword] = useState('');
           const [password2, setPassword2] = useState('');
           const [users, setUsers] = useState([]);
           const [registering, setRegistering] = useState(false);

           let changeEmail = (e) =>{
               let email = e.target.value;
               setEmail(email);
           };
           let changeUsername = (e) =>{
            let username = e.target.value;
            setUsername(username);
           };

           let changePassword = (e) =>{
            let password = e.target.value;
            setPassword(password);
           };

           let changePassword2 = (e) =>{
            let password2 = e.target.value;
            setPassword2(password2);
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
               
              setRegistering(true);

              data.append('photo', photo);
              console.log(photo);
              data.append('email', email);
              data.append('username', username);
              data.append('password', password);

              console.log(email); 

              
              //let checkUsername = users.filter(user=>user.username.toLowerCase().includes(username));

              let checkUsername = users.map(user=>user.username);
              let checkEmail = users.map(user=>user.email);

              if(checkUsername.includes(username)){
                  console.log(checkUsername);
                  let err = 'Username exist';
                  console.log(err);
                  toast.error('Username exist');
                  return false;
              };

              if(checkEmail.includes(email)){
                console.log(checkEmail);
                let err = 'Email exist';
                console.log(err);
                toast.error('Email exist');
                return false;
            }; 
             /* if(!email || !username || !password || !photo){
                 let err = 'You can not submit empty form';
                 console.log(err);
                 toast.error('You can not submit empty form');
                 return false;         
              }; */

              if(password !== password2 ){
                 let err = 'Password do not match';
                 console.log(err);
                 toast.error('Password do not match');
                 setPassword('');
                 setPassword2('');
                 return false;
              }

              if(password.length < 4){
                let err = 'Password must be atleast 4 unique characters';
                console.log(err);
                toast.error('Password must be atleast 4 unique characters');
                setPassword('');
                setPassword2('');
                return false;
             }else{

                 
               axios.post('/api/user/register', data)
               .then(res=>{
                   console.log(res.data)
                   if(res.data === 'user exist'){
                    setUsername('');
                    toast.error('Username already exist')
                    return false;
                   }else{
                   setPassword('');
                   setPassword2('');
                   setUsername('');
                   setEmail('');
                   setPhoto('');
                   setRegistering(false);
                   toast.success('Registered, verification code sent to your email');
                   setTimeout(()=>{
                     window.location.href='/user/verify-email';

                    }, 2000) 
                    
                 return true;
                }
               
                 })

               .catch(err=>{
                   console.log(err.response);
                   toast.error('Oops! An error occur, try again');
                   setRegistering(false);
               })

               return true;
             }
              

           }


           useEffect(()=>{
        let localState = localStorage.getItem('currentUser')
            console.log(localState)
            axios.get('/api/users')
            .then(res=>{
                console.log(res.data)
                let users = res.data
                setUsers(users)
            })

            .catch(err=>{
                console.log(err.response)
            })
      
        }, []) 

    return(
           
        <div className="container-fluid login">
           <h5 className="pt-4 text-center text-white">Welcome to Discussion</h5>
           <p className="text-center text-white"> Hi! Please register to have full access </p>
           {registering? <p className="text-center text-white">Please wait...</p> : ' '}

           <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={onSubmit}>
               <div className="form-group">
               <label className="text-white" >Email</label>

                   <input className="form-control login-control" type="email" placeholder="enter email" value={email} onChange={changeEmail} />
               </div>
               <div className="form-group mt-3">
                   <label className="text-white" >Username</label>
                   <input className="form-control login-control" type="text" placeholder="username" value={username} onChange={changeUsername}/>
               </div>
               <div className="form-group mt-3">
               <label className="text-white" >Photo</label>

                <input className="form-control login-control" type="file" placeholder="photo" defaultValue={photo} onChange={changePhoto}/>
               </div>
               <div className="form-group mt-3">
               <label className="text-white">Password</label>

                   <input className="form-control login-control" type="password" placeholder="enter password" value={password} onChange={changePassword} />
               </div>
               <div className="form-group mt-3">
               <label className="text-white" >Re-enter password</label>

                   <input className="form-control login-control" type="password" placeholder="confirm password" value={password2} onChange={changePassword2}/>
               </div>
               <div className="form-group mt-3">
                   <button className="btn login-btn">Signup</button>
               </div>
           </form>
           <h5 className=" text-white text-center mt-3">Already a registered user?</h5>
            <Link className="d-flex justify-content-center text-white login-link" to="/">Login</Link>
        </div>
    )
}


export default Register;