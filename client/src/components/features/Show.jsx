import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Header from '../Header';
import Footer from '../Footer';
import Searchbar from '../Searchbar';
dayjs.extend(relativeTime);

function Show(){

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [loadData, setLoadData] = useState(false);
   const [commentBody, setCommentBody] = useState('');
    const [commentLoader, setCommentLoader] = useState(false);
     const [comments, setComments] = useState('');
      const [createdAt, setCreatedAt] = useState('');
      const [username, setUsername] = useState('');
      const [photo, setPhoto] = useState('');


      let {slug} = useParams();
      console.log(slug);



      let current = localStorage.getItem('online');
      let currentUser = JSON.parse(current);

      useEffect(()=>{
        axios.get('/api/feature/'+slug)
        .then(res=>{
            console.log(res.data);
            setTitle(res.data.title);
            setDescription(res.data.description);
            setImage(res.data.image);
            setCreatedAt(res.data.createdAt);
            setUsername(res.data.username);
            setPhoto(res.data.photo)
            setLoadData(true);
        })
        .catch(err=>{
            console.log(err.response)
            
        });

        let userView = {
           username: currentUser.username
        }
        axios.post('/api/feature/views/'+slug, userView)
        .then(res=>{
            console.log(res.data);
          
        })
        .catch(err=>{
            console.log(err.response)
            
        });

        //Getting comments//

        axios.get('/api/comments/feature/'+slug)
        .then(res=>{
            console.log(res.data);
            setComments(res.data.comments)
          
        })
        .catch(err=>{
            console.log(err.response)
            
        });

        console.log(title)
        
  }, [currentUser.username, slug, title]);


       let changeComment=(e)=>{
           let commentBody = e.target.value;
           setCommentBody(commentBody);
       };

       let submitComment = (e) =>{
           e.preventDefault();
             setCommentLoader(true);
           let comment = {
                commentUser : currentUser.username,
                commentPhoto : currentUser.photo,
                commentBody : commentBody
           }

             if(!commentBody){
               let err = 'You can not submit an empty form';
               console.log(err);
                toast.error('You can not submit an empty form');
                return false;
           }else{

                axios.post('/api/comment/feature/'+slug, comment)
                .then(res=>{
                    console.log(res.data.comments)
                    setCommentLoader(false);
                    setCommentBody('');
                    toast.success('Comment posted');
                   
                    setComments(res.data.comments);
                })
                .catch(err=>{
                    console.log(err.response)
                    setCommentLoader(false);

                })
               return true;
           }
       }
         let theComments = Array.from(comments);

         document.title = `Discussion | ${slug}`;
    return(
             <>
           <Header/> 
           <div class="container-fluid">
         <div className="container profile my-4">
             <div className="d-flex justify-content-center">
                 <div className="">
                 <img className="image " src={currentUser.photo} alt=""/>
                 </div>
                 <p className="para">Tell others what is happening</p>

                   <Searchbar/>
             </div>
           
         </div>
         {loadData ? '' : <h5 className="loader text-center">Loading ... </h5>}
         <div className=" col-md-6 show-header mx-auto mt-5">
            <h5 className="feature_title">{title} <span className=""> by <Link className="" to={`/user/${username}`}><span className="show-name">  {username}</span> <img className="image img-thumbnail" src={photo} alt="profile" /> </Link> Posted {dayjs(createdAt).format('DD/MM/YYYY')}</span></h5>

                </div> 
         <div className="col-md-6 show-page mb-5 d-block mx-auto">

             <p>{description}</p>
             <img className="img-fluid d-block mx-auto my-3" src={image} alt=""  />

           <form className="my-3 p-2" onSubmit={submitComment}>
               <div className="form-group">
                   <label>Leave a Reply </label>
                   <textarea className="form-control" rows="5" placeholder="comment..." value={commentBody} onChange={changeComment} />
               </div>
               <div className="form-group mt-3">
                  <button className="btn btn-show bg-white" type="submit">Post Comment</button>
               </div>
           </form>
           <div className="container mt-4">
               {commentLoader? <p className="text-center text-white">Posting comment...</p> : ' '}
               {theComments.length > 0 ? <h5 className="mb-3">All Comments </h5>: 'No comment posted yet'}
                
               {theComments.map(comment=>{
                   return( 
            <div className="d-flex align-items-center mb-3" key={comment._id}>
              
                <div className="flex-shrink-0">
                <Link className="" to={`/user/${comment.commentUser}`}> <img className="mr-3 img-thumbnail" src={comment.commentPhoto} alt="" style={{height: '64px', width: '64px'}}/></Link>
                </div>
                <div className="flex-grow-1 ms-3">
                <Link className="" to={`/user/${comment.commentUser}`}><h5 className="">{comment.commentUser}</h5></Link>
                   <p>{comment.commentBody}</p>
                </div>
            </div>
             )
            })}
            </div>
         </div>
         </div>
     <Footer/>
     </>
    )
}


export default Show;