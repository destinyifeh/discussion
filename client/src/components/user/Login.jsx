import {useEffect, useState} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
function Login(){
         const [username, setUsername] = useState('');
         const [password, setPassword] = useState('');
          const [users, setUsers] = useState([]);        
          const [isLogin, setIsLogin] = useState(false);

      let changeUsername = (e) =>{
          let username = e.target.value;
           setUsername(username);
      };

      let changePassword = (e) =>{
        let password = e.target.value;
         setPassword(password)
    };

  
      let onSubmit=(e)=>{
           e.preventDefault();
           
           setIsLogin(true);

          let verified = users.map(user=>user.isVerified !== 'true');
            console.log(verified)
           let checkUsername = users.filter(user=>user.username.toLowerCase().includes(username) || user.username.toUpperCase().includes(username));
             console.log(checkUsername)
           if(!username || !password){
            let err = 'You can not submit empty form';
            console.log(err);
            toast.error('You can not submit empty form');
            return false;
           }
           if(!verified){
               let err = 'This email is not verified';
               console.log(err)
               toast.error('This email is not verified');
            
               return false;
           }
           if(checkUsername){
            let success = 'User found';
            console.log(success);
            
           let userInfo = {
            username: username,
            password: password
        }

        console.log(userInfo)

        axios.post('/api/user/login', userInfo)
        .then(res=>{
            
            if(res.data === 'Incorrect password'){
                let err = 'Incorrect password';
                setIsLogin(false);
                setPassword('');
                console.log(err);
                toast.error('Incorrect password')

            }else{
               console.log(res.data);
                 setUsername('');
                 setPassword('');
                 setIsLogin(false);
                 toast.success('logged in');

                localStorage.setItem('online', JSON.stringify(res.data));
                     
                 localStorage.setItem('userId', JSON.stringify(res.data._id));
                                       
                    setTimeout(()=>{
                      window.location.href='/user/security-check';
          
                         }, 2000)
                 
             }

            
        })

        .catch(err=>{
            console.log(err.response);
            toast.error('Oops! An error occurred, try again');
            setIsLogin(false);

        })
        return true;
        }else{
             let err = 'No user';
             console.log(err)
             toast.error('No user found')
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
            });

          toast.info('login to have full access');
            

        }, [])    

     


           document.title = 'Discussion | Login' ;

    return(
           
        <div className="container-fluid login">
           <h5 className="pt-4 text-center text-white">Welcome to Discussion</h5>
           <p className="text-center text-white"> Hi! Please login to have full access </p>
           {isLogin? <p className="text-center text-white">Please wait...</p> : ' '}
           <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={onSubmit}>
               <div className="form-group">
               <label className="text-white" >Username</label>

                   <input className="form-control login-control" type="text" placeholder="enter username" value={username} onChange={changeUsername} />
               </div>
               <div className="form-group mt-3">
               <label className="text-white" >Password</label>

                   <input className="form-control login-control" type="password" placeholder="enter password" value={password} onChange={changePassword} />
               </div>
               <div className="form-group mt-3">
                   <button className="btn login-btn">Login</button>
               </div>
           </form>
           <div className="d-flex justify-content-between my-2 col-lg-6 mx-lg-auto">
           <Link className=" text-white login-link" to="/user/register">Signup</Link>

           <Link className=" text-white login-link " to="/user/forgot">Forgot password?</Link>

           </div>

        </div>
    )
}


export default Login;