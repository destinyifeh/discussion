import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';

function Reset(props){
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    
    
    let changePassword = (e) =>{
        let password = e.target.value;
        setPassword(password);
       };

       let changePassword2 = (e) =>{
        let password2 = e.target.value;
        setPassword2(password2);
       };

       let {id} = useParams();             

           let onSubmit=(e)=>{
               e.preventDefault();

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
                 let data = {
                     password: password
                 }
                
              axios.post('/api/reset-password/'+id, data)
              .then(res=>{
                  console.log(res.data)
                  setPassword('');
                  setPassword2('');
                  toast.success('Password changed successfully');
                   setTimeout(()=>{
                    window.location.href='/';

                   }, 2000) 
                })

              .catch(err=>{
                  console.log(err.response);
                  toast.error('Oops! An error occur, try again')
              })

              return true;
            }
           };

           useEffect(()=>{
               
              console.log(id)
           }, [id])

    return(
           
        <div className="container-fluid login">
           <h5 className="pt-4 text-center text-white">Welcome to Discussion</h5>
           <p className="text-center text-white"> Hi! Please enter your new password </p>
           <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={onSubmit}>
               <div className="form-group">
               <label className="text-white" >New Password</label>

                   <input className="form-control login-control" type="password" placeholder="enter password" value={password} onChange={changePassword} />
               </div>
               <div className="form-group mt-3">
               <label className="text-white" >Re-enter Password</label>

                   <input className="form-control login-control" type="password" placeholder="re-enter password"value={password2} onChange={changePassword2} />
               </div>
               <div className="form-group mt-3">
                   <button className="btn login-btn">Reset</button>
               </div>
           </form>
           <div className="d-flex justify-content-between my-2 col-lg-6 mx-lg-auto">
           <Link className=" text-white login-link" to="/user/register">Signup</Link>

           <Link className=" text-white login-link " to="/user/login">Login</Link>

           </div>

        </div>
    )
}


export default Reset;