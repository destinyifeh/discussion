import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';

function VerifyCode(){

       const [resetPasswordToken, setResetPasswordToken] = useState('');
         const [users, setUsers] = useState([]);

       let changeToken = (e) =>{
           let resetPasswordToken = e.target.value;
           setResetPasswordToken(resetPasswordToken);
       };


       let onSubmit=(e)=>{
           e.preventDefault();

           let checkToken = users.map(user=>user.resetPasswordToken)
           if(!resetPasswordToken){
               let err ='You can not submit empty form';
               console.log(err)
               toast.error('You can not submit empty form');
               return false;
           };
           if(resetPasswordToken.length !== 6){
            let err ='Password reset code must be six digit number';
            console.log(err)
            toast.error('Password reset code must be six digit number');
            return false;
        };

          if(checkToken.includes(resetPasswordToken)){
              let success = 'resetPasswordToken found';
               console.log(success)
            let code = {
                resetPasswordToken: resetPasswordToken
            }

            axios.post('/api/reset-password-code', code)
            .then(res=>{
                console.log(res.data);
                if(res.data === 'Password reset token is invalid or has expired'){
                    toast.error('Password reset token is invalid or has expired');
                    setResetPasswordToken('');
                }else{
                    setResetPasswordToken('');
                    toast.success('Valid');
                    let userId = res.data._id;
                    console.log(userId)
                  window.location.href='/user/reset-password/'+userId;
    
                }
               
            })
            .catch(err=>{
                console.log(err.response)
                toast.error('Oops! An error occur, try again')
                setResetPasswordToken('');
            })
             return true;
          }else{
              let err = 'No password reset code found';
                console.log(err);
                setResetPasswordToken('');
                toast.error('password reset code not found');
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
           <p className="text-center text-white"> Hi! Please enter password reset code sent to your email</p>
           <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={onSubmit}>
               <div className="form-group">
                   <input className="form-control login-control" type="text" placeholder="enter password reset code" value={resetPasswordToken} onChange={changeToken} />
               </div>
             
               <div className="form-group mt-3">
                   <button className="btn login-btn">Confirm</button>
               </div>
           </form>
           <div className="d-flex justify-content-between my-2 col-lg-6 mx-lg-auto">
           <Link className=" text-white login-link" to="/user/forgot-password">Go back</Link>

           <Link className=" text-white login-link " to="/user/login">Login</Link>

           </div>

        </div>
    )
}


export default VerifyCode;