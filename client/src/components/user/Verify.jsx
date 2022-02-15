import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';

function Verify(){

       const [emailToken, setEmailToken] = useState('');
         const [users, setUsers] = useState([]);

       let changeToken = (e) =>{
           let emailToken = e.target.value;
           setEmailToken(emailToken);
       };


       let onSubmit=(e)=>{
           e.preventDefault();

           let checkToken = users.map(user=>user.emailToken)
           if(!emailToken){
               let err ='You can not submit empty form';
               console.log(err)
               toast.error('You can not submit empty form');
               return false;
           };
           if(emailToken.length !== 6){
            let err ='Verification code must be six digit number';
            console.log(err)
            toast.error('Verification code must be six digit number');
            return false;
        };

          if(checkToken.includes(emailToken)){
              let success = 'Email token found';
               console.log(success)
            let code = {
                 emailToken: emailToken
            }

            axios.post('/api/email-verification', code)
            .then(res=>{
                console.log(res.data);
                setEmailToken('');
                toast.success('verified');
                setTimeout(()=>{
              window.location.href='/user/login';

                }, 2000)
            })
            .catch(err=>{
                console.log(err.response)
                toast.error('Oops! An error occurred, try again')
            })
             return true;
          }else{
              let err = 'No verification code found';
                console.log(err);
                setEmailToken('');
                toast.error('Verification code not found');
                return false;
          }
           
       };

       useEffect(()=>{

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
           <p className="text-center text-white"> Hi! Please enter verification code sent to your email</p>
           <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={onSubmit}>
               <div className="form-group">
                   <input className="form-control login-control" type="text" placeholder="enter verification code" value={emailToken} onChange={changeToken} />
               </div>
             
               <div className="form-group mt-3">
                   <button className="btn login-btn">Verify</button>
               </div>
           </form>
           <div className="d-flex justify-content-between my-2 col-lg-6 mx-lg-auto">
           <Link className=" text-white login-link" to="/user/register">Signup</Link>

           <Link className=" text-white login-link " to="/user/login">Login</Link>

           </div>

        </div>
    )
}


export default Verify;