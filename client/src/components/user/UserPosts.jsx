import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import Header from '../Header';
import Footer from '../Footer';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
function UserPosts(){

  const [data, setData] = useState('');
 const [isLoading, setIsLoading] = useState(true);


 
    
 let current = localStorage.getItem('online');
 let currentUser = JSON.parse(current)

  useEffect(()=>{
  axios.get('/api/features/search')
  .then(res=>{
      console.log(res.data)
      setIsLoading(false);
      setData(res.data.filter(feature=>feature.username === currentUser.username));


  })
  .catch(err=>{
    console.log(err.response)
    setIsLoading(false);

  });

  

}, [currentUser.username])


let handleDelete=(slug)=>{
  console.log(slug)
  axios.delete('/api/delete/feature/'+slug)
  .then(res=>{
      console.log(res.data)
      setData({data: data.filter(feature=>feature.slug !== slug)});
      toast.success('Deleted');
      setTimeout(()=>{
         window.location.href='/';
      },1000)
  })
  .catch(err=>{
      console.log(err.response)
      toast.error('An error occur, try again')
  })
};
  
      let userFeatures = Array.from(data);
    return(
          <>
          <Header/> 
        <div className="container col-md-4 my-4">
        <h5 className="text-center">My Posts</h5>
         
        {isLoading? <h5 className="text-center">Loading....</h5> : ' '}

{userFeatures.length > 0 ? userFeatures.map(feature=>{
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
        <p><i className="fa fa-pencil"></i></p>
        <Link className="" to={`/edit/feature/${feature.slug}`}>edit /</Link>
        <Link className="text-danger" to="#" onClick={()=>{handleDelete(feature.slug)}}> delete</Link>
        <p><i className="fa fa-trash ml-2"></i></p>

       </div>

    </div>
    <div className="card-footer">
        <span className=" p-2"> <Link className="add-comment" to={`/feature/${feature.slug}`}><img className="image " src={currentUser?currentUser.photo: ''} alt=""/> Add a comment</Link></span>
     </div>
</div>
  )
}) : <p className="text-center">No post yet</p>}
          
 </div>
 <Footer/>
  </>
    )
}


export default UserPosts;