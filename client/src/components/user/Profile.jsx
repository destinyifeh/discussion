import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import Header from '../Header';
import Footer from '../Footer';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

function Profile(){
        const [user, setUser] = useState('');
        const [email, setEmail] = useState('');
        const [sender, setSender] = useState('');
        const [message, setMessage] = useState('');
        const [data, setData] = useState('');
        const [isLoading, setIsLoading] = useState(true);
        const [sending, setSending] = useState(false);
        const [senderName, setSenderName] = useState('');


    const {username} = useParams();


          let changeReceiver = (e) =>{

            let email = e.target.value;
              setEmail(email);
          };

          let changeSender = (e) =>{
              let sender = e.target.value;
              setSender(sender)
          };

          let changeMessageBody = (e) =>{
              let message = e.target.value;
              setMessage(message)
          };

      let submitMessage = (e) =>{
          e.preventDefault();
           
          setSending(true);

          let messages = {
            sender_email: sender,
            sender_name : senderName,
            receiver: email,
            messageBody : message,
          }
             
          console.log(messages)

          if(!message){
              let err = 'Please write something before submitting';
              console.log(err);
              toast.error('Please write something before submitting');
              return false;
          }else{

            axios.post('/api/user/message', messages)
            .then(res=>{
                console.log(res.data)
                setMessage('');
                setSending(false);
                toast.success('Message sent');
                
            })
            .catch(err=>{
                console.log(err.response);
                setSending(false);
                toast.error('Message not sent, try again')
            })
            return true;
          }
      }

    
    let current = localStorage.getItem('online');
    let currentUser = JSON.parse(current);

        useEffect(()=>{
            setSender(currentUser.email)
             setSenderName(currentUser.username)
            axios.get('/api/user/'+username)
            .then(res=>{
                console.log(res.data)
                setUser(res.data)
                setEmail(res.data.email)
            })
            .catch(err=>{
                console.log(err.response)
            });


       axios.get('/api/features/search')
     .then(res=>{
         console.log(res.data)
       setData(res.data.filter(feature=>feature.username === username));
 
       setIsLoading(false);


  })
  .catch(err=>{
    console.log(err.response)
    setIsLoading(false);

  })

  }, [username, currentUser.email, isLoading, currentUser.username]);

          let handleInput=(e)=>{
              e.preventDefault();
              console.log(e)
          }


              let userPosts = Array.from(data);
              console.log(userPosts)
    return(
        <>
        <Header/>
        <div className="container profile-content my-4">
           <div className="row">
               {isLoading? <h5 className="text-center">Loading....</h5> : ' '}
               <div className="col-md-4 my-2">
                <h5 className="text-center">Info</h5>
                <div className="container members">
                         <div className="text-center infos">
                          <img className="images  img-thumbnail" src={user.photo} alt=" "/>
                         <p> Username: {user.username} </p>
                         <p>Status: {user.isAdmin? 'Admin' : 'Member' }</p>
                        <p className="">Registered date: {dayjs(user.createdAt).format('DD/MM/YYYY')}</p>
                         </div>
                     </div>
                   </div>
               <div className="col-md-4">
               <h5 className="text-center userText my-2">{user.username} Posts </h5>
                    {userPosts.length > 0 ? userPosts.map((feature)=>{
                        return(
                            <div className="card mb-3" key={feature._id}>
                            <div className="p-2">
                            <span className=" p-2"> <Link className="card-name" to={`/user/${feature.username}`}><img className="image " src={feature.photo} alt=""/> {feature.username}</Link> <span className="status" > . {currentUser && currentUser.admin? 'Admin' : 'Member'}</span></span>
                            <strong> <i className="fa fa-clock-o"></i> {dayjs(feature.createdAt).fromNow()}</strong>
                             <Link className="" to={`/feature/${feature.slug}`}><h5 className="mt-1">{feature.title} </h5></Link>
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
                   }) : <p className="text-center">No post yet</p>}      
   
                   

                 </div>
                 {currentUser.username === user.username?'':
                 <div className="col-md-4">
                     {sending? <p className="text-center">Please wait.... message is sending</p>: ''}
                 <h5 className="">Contact <span className="">( {user.username} )</span></h5>
                  <form className="" onSubmit={submitMessage}>
                     
                      <div className="form-group">
                          <label className="profile-text">Your email</label>
                          <input className="form-control" type="email" value={sender}  onMouseDown={handleInput} onChange={changeSender}/>
                      </div>
                      <div className="form-group">
                          <label className="profile-text">Message</label>
                          <textarea className="form-control" placeholder="message...." rows="5" value={message} onChange={changeMessageBody} /> 
                      </div>
                      <div className="form-group mt-3">
                         <button className="btn profile-btn" type="submit">Send</button>
                      </div>
                      <div className="form-group">
                          <input className="form-control receiver" type="email" value={email} onMouseDown={handleInput} onChange={changeReceiver}/>
                      </div>
                  </form>
                   </div>
                 }
           </div>
        </div>
        <Footer/>
        </>
    )
}

export default Profile;