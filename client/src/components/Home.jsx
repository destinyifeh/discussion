import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Header from './Header';
import Footer from './Footer';
//import test1 from '../images/staff3.jpg';
dayjs.extend(relativeTime);

function Home(){
    const [online, setOnline] = useState('');
    const [query, setQuery] = useState('');
    const [data, setData] = useState('');
     const [loadData, setLoadData] = useState(false);
     const [recent, setRecent] = useState(''); 
      const [verified, setVerified] = useState('');


     let current = localStorage.getItem('online');
     let currentUser = JSON.parse(current);

    let changeQuery = (e) =>{
        setQuery(e.target.value);
    } ;

    let onSubmit = (e) =>{
        e.preventDefault();
        console.log(e)

        window.location.href=`/search/query=${query}`;
    };
     
  
    
    useEffect(()=>{
        axios.get('/api/online-users')
        .then(res=>{
            console.log(res.data)
            
            
           setOnline(res.data)
            
        })
        .catch(err=>console.log(err.response));

        axios.get('/api/features')
        .then(res=>{
            console.log(res.data)
            setData(res.data);
            setLoadData(true);
        })
        .catch(err=>{
            console.log(err.response)
        });

        
        axios.get('/api/features/recent')
        .then(res=>{
            console.log(res.data)
            setRecent(res.data);
        })
        .catch(err=>{
            console.log(err.response)
        });

        
        axios.get('/api/verified/users')
        .then(res=>{
            console.log(res.data)
            setVerified(res.data);
        })
        .catch(err=>{
            console.log(err.response)
        });
         
        
         
 }, [])
         

      let onlineUsers = Array.from(online);
           console.log(onlineUsers.length)

        let features = Array.from(data);
        let recentFeatures = Array.from(recent);
        let allUsers= Array.from(verified);

    return(
     
       <>
         <Header/>
         <div className="container-fluid">
         <h4 className="text-center mt-4">Welcome To Discussion</h4>
         <p className="text-center">The people's forum</p>
         <p className="text-center">Registered users: {allUsers.length} | <span className="text-success">Members online: {onlineUsers.length}</span></p>

         <p className="text-center">Date: {dayjs().format('DD/MM/YYYY')}, <span className="">Time: {dayjs().format('h:ma')}</span></p>
          
         <div className="container profile my-4">
             <div className="d-flex justify-content-center">
                 <div className="">
                 <img className="image" src={currentUser?currentUser.photo: ''} alt=""/>
                 </div>
                 <p className="para">Tell others what is happening</p>

                 <form className="my-2 home-form d-none d-lg-inline" onSubmit={onSubmit}>
              <div className="input-group">
                  <input type="search" className="form-control lg-search shadow-none" placeholder="Search..."  value={query} onChange={changeQuery} />
                  <div className="input-group-append">
                      <button className="btn search-btn" ><i className="fa fa-search"></i></button>
                      </div>
              </div>
          </form>
             </div>
           
         </div>

          <div className="container my-4">
              {loadData ? '' : <h5 className="loader text-center">Loading ... </h5>}
              <div className="row">
                  <div className="col-md-4">
                      <h5 className="text-center">Hot Gists</h5>
                     {features.map(feature=>{
                         return(
                      <div className="card mb-3" key={feature._id}>
                          <div className="p-2">
                          <span className=" p-2"> <Link className="card-name" to={`/user/${feature.username}`}><img className="image " src={feature.photo} alt=""/> {feature.username}</Link> <span className="status" > . {currentUser && currentUser.admin? 'Admin' : 'Member'}</span></span>
                          <strong> <i className="fa fa-clock-o"></i> {dayjs(feature.createdAt).fromNow()}</strong>
                           <Link className="" to={`/feature/${feature.slug}`}><h5 className="mt-1 feature_title">{feature.title} </h5></Link>
                          <p className="card-text">{feature.description.substring(0, 60)}...</p> 
                          </div>
                          
                         <img className="img-card-top" src={feature.image} alt=""/>
                          <div className="d-flex justify-content-between">
                             <div className="d-flex justify-content-even p-2">
                             <p><i className="fa fa-eye"></i> {feature.viewedBy.length} views </p>
                              <p><i className="fa fa-comment"></i> {feature.comments.length} comments </p>
                             </div>
                             <div className="d-flex justify-content-even p-2">
                              <Link className="" to={`/report/feature/${feature.title}`}>report <i className="fa fa-angle-double-right"></i></Link>
                              

                             </div>
   
                          </div>
                          <div className="card-footer">
                          <span className=" p-2"> <Link className="add-comment" to={`/feature/${feature.slug}`}><img className="image " src={currentUser?currentUser.photo: ''} alt=""/> Add a comment</Link></span>
                          </div>
                      </div>
                     )
                    })}
                  </div>
                  <div className="col-md-4">
                      <h5 className="text-center"> Recent</h5>
                      {recentFeatures.map(feature=>{
                         return(
                      <div className="card mb-3" key={feature._id}>
                          <div className="p-2">
                          <span className=" p-2"> <Link className="card-name" to={`/user/${feature.username}`}><img className="image " src={feature.photo} alt=""/> {feature.username}</Link> <span className="status" > . {currentUser && currentUser.admin? 'Admin' : 'Member'}</span></span>
                          <strong> <i className="fa fa-clock-o"></i> {dayjs(feature.createdAt).fromNow()}</strong>
                           <Link className="" to={`/feature/${feature.slug}`}><h5 className="mt-1 feature_title">{feature.title} </h5></Link>
                          <p className="card-text">{feature.description.substring(0, 60)}...</p> 
                          </div>
                          
                         <img className="img-card-top" src={feature.image} alt=""/>
                          <div className="d-flex justify-content-between">
                             <div className="d-flex justify-content-even p-2">
                             <p><i className="fa fa-eye"></i> {feature.viewedBy.length} views </p>
                              <p><i className="fa fa-comment"></i> {feature.comments.length} comments </p>
                             </div>
                             <div className="d-flex justify-content-even p-2">
                             <Link className="" to={`/report/feature/${feature.title}`}>report <i className="fa fa-angle-double-right"></i></Link>
                                
                             </div>
   
                          </div>
                          <div className="card-footer">
                          <span className=" p-2"> <Link className="add-comment" to={`/feature/${feature.slug}`}><img className="image " src={currentUser?currentUser.photo: ''} alt=""/> Add a comment</Link></span>
                          </div>
                            
                      </div>
                      
                     )
                    })}
                    
                  </div>
                  <div className="col-md-4">
                      <h5 className="text-center">Members Online</h5>
                      <div className="container members">
                          {onlineUsers.length>0?onlineUsers.map(online=>{
                              return(
                         <div className=" border-bottom" key={online._id}>
                         <span className=" p-2"> <Link className="members-link" to={`/user/${online.loginUsername}`}><img className="images  img-thumbnail d-block mx-auto" src={online.photo} alt=" Profile"/> </Link></span>
                          <p className="text-center"><Link className="members-link" to={`/user/${online.loginUsername}`}> {online.loginUsername} <span className="text-success">/online</span></Link></p>

                         </div>
                         )
                          }): 
                             ' '
                         }
                        
                      </div>
                  </div>
              </div>
          </div>
         </div>
         <Footer/>
       </>
    )
}



export default Home;