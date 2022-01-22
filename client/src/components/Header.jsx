import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
//import Typed from 'react-typed'
import {toast} from 'react-toastify';
import axios from 'axios';
function Header(){
             const [show, setShow] = useState(false); 
            const [remove, setRemove] = useState(true); 
            const [online, setOnline] = useState('');
             const [query, setQuery] = useState('');

             const handleShow=()=>{
                 setShow(true);
                 setRemove(false);
             }

             const handleRemove=()=>{
                setRemove(true);
                setShow(false);
            }
             
            const handleList=()=>{
                setTimeout(()=>{
                    setRemove(true);
                    setShow(false);
                },1000)
            }

          


            const handleSearchBtn=()=>{
                setTimeout(()=>{
                    setRemove(true);
                    setShow(false);
                   
                },1000)
            }
  


          

      useEffect(()=>{
             axios.get('/api/online-users')
             .then(res=>{
                 console.log(res.data)
                 setOnline(res.data)
             })
             .catch(err=>console.log(err.response))
      }, [])


      let handleLogout = (username) =>{
          console.log(username)
          let loginUsername = username;
          axios.delete('/api/delete/online-user/'+loginUsername)
          .then(res=>{
              console.log(res.data)
              let data = online.filter(isOnline=>isOnline.loginUsername!==loginUsername)
              console.log(data)
              setOnline(data);
              console.log(online)
          })
          .catch(err=>console.log(err.response))
          
          localStorage.removeItem('online');
          localStorage.removeItem('userId');
          toast.success('logged out');
          setTimeout(()=>{
          window.location.href='/user/login';
           }, 1000)
      };


      //For search-bar//

      let changeQuery = (e) =>{
        setQuery(e.target.value);
        console.log(e)
    } ;

    let onSearch = (e) =>{
         e.preventDefault();
        window.location.href=`/search/query=${query}`;
    };

       let current = localStorage.getItem('online');
       let currentUser = JSON.parse(current)
      // console.log(currentUser)
       //let onlineUsers = Array.from(online);
      // let userId = currentUser._id;
    return(
        <>
       <div className="container-fluid navbar d-flex justify-content-between sticky-top">
           <Link className="logo" to="/">Discussion </Link>
           
            <Link className="" to={`/user/${currentUser?currentUser.username: ''}`}>Welcome back, {currentUser?currentUser.username : ''}</Link>
           <ul className="nav d-none d-lg-flex">
               <li className="nav-item">
                   <Link className="nav-link" to="/">Home</Link>
               </li>
               <li className="nav-item">
                   <Link className="nav-link" to={`/user/edit/${currentUser?currentUser.username: ''}`}>Profile</Link>
               </li>
              
               <li className="nav-item">
                   <Link className="nav-link" to="/feature/new">Create Post</Link>
               </li>
               <li className="nav-item">
                   <Link className="nav-link" to="/user/features">My Posts</Link>
               </li>
               <li className="nav-item">
                   {currentUser? 
                   <Link className="nav-link" to="#" onClick={()=>{handleLogout(currentUser.username)}}>Logout</Link>
                    :  <Link className="nav-link" to="/user/login" >Login</Link>

                    }  
               </li>
           </ul>
             {remove? 
           <i className="fa fa-reorder text-white d-lg-none" onClick={handleShow}></i>
           : ''}
           {show?
           <i className="fa fa-times text-white d-lg-none"  onClick={handleRemove}></i>
           : ''}

       </div>
       {show?
          <form className="my-2" onSubmit={onSearch}>
              <div className="input-group">
                  <input type="search" className="form-control sm-search shadow-none" placeholder="Search..." value={query} onChange={changeQuery} />
                  <div className="input-group-append">
                      <button className="btn search-btn" onClick={handleSearchBtn}><i className="fa fa-search"></i></button>
                      </div>
              </div>
          </form>
              : ''}
           {show?  
            <ul className="nav d-lg-none d-block float-start mobile-nav">
               <li className="nav-item">
                   <Link className="nav-link" to="/" onClick={handleList}>Home</Link>
               </li>
               <li className="nav-item">
                   <Link className="nav-link" to={`/user/edit/${currentUser.username}`} onClick={handleList}>Profile</Link>
               </li>
              
               <li className="nav-item">
                   <Link className="nav-link" to="/feature/new" onClick={handleList}>Create Post</Link>
               </li>
                
               <li className="nav-item">
                   <Link className="nav-link" to="/user/features" onClick={handleList}>My Posts</Link>
               </li>
               <li className="nav-item">
                   {currentUser? 
                   <Link className="nav-link" to="#" onClick={()=>{handleLogout(currentUser.username)}}>Logout</Link>
                    :  <Link className="nav-link" to="/user/login" >Login</Link>

                    }  
               </li>
              
           </ul>
            : ''}
       </>
       
    )
}

export default Header;