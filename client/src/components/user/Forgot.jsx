import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';

function Forgot(){
            
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(false);

    let changeEmail=(e)=>{
        let email = e.target.value;
        setEmail(email);
 
    }


     let onSubmit=(e)=>{
         e.preventDefault();
         

          let checkEmail = users.map(user=>user.email)
               
           if(!email){
               let err = 'You can not submit empty form';
               console.log(err)
               toast.error('You can not submit empty form');
               return false;
           };

            if(checkEmail.includes(email)){
              
                   setLoading(true);

                let forgotEmail = {
                     email: email
                }
                 
                axios.post('/api/forgot/password', forgotEmail)
                .then(res=>{
                    console.log(res.data);
                    toast.success('Password reset code sent to your email')
                     setEmail('');
                     setLoading(false)
                     setTimeout(()=>{
                     window.location.href="/user/reset-code";
                     }, 2000)
                })
                .catch(err=>{
                    console.log(err.response)
                     setEmail('');
                     setLoading(false);
                    toast.error('Oops! An error occur, try again')
                })
                
            }
     }


     
     useEffect(()=>{
     
        axios.get('/api/users')
        .then(res=>{
            console.log(res.data)
            let users = res.data;
            setUsers(users);
        })

        .catch(err=>{
            console.log(err.response)
        })
    }, [setUsers])  

    return(
           
        <div className="container-fluid login">
           <h5 className="pt-4 text-center text-white">Welcome to Discussion</h5>
           <p className="text-center text-white"> Hi! Please enter your acccount email</p>
           <p className="text-center text-white">{loading? 'Please wait, sending reset code....' : ' '}</p>

          <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={onSubmit}>
               <div className="form-group">
                   <input className="form-control login-control" type="email" placeholder="enter email" value={email} onChange={changeEmail} />
               </div>
             
               <div className="form-group mt-3">
                   <button className="btn login-btn">Send reset code</button>
               </div>
           </form>
           <div className="d-flex justify-content-between my-2 col-lg-6 mx-lg-auto">
           <Link className=" text-white login-link" to="/register">Signup</Link>

           <Link className=" text-white login-link " to="/login">Login</Link>

           </div>

        </div>
    )
}


export default Forgot;