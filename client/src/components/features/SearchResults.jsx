import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Footer from '../Footer';
import Header from '../Header';
dayjs.extend(relativeTime);

function SearchResults(){
        
          const [data, setData] = useState('');
           const [loadData, setLoadData] = useState(false);
          const {query} = useParams();
          const [isLoading, setIsLoading] = useState(false);

       useEffect(()=>{
        console.log(query);
        setIsLoading(true);
           axios.get('/api/features/search')
           .then(res=>{
               console.log(res.data)
               let data = res.data.filter(search=>search.title.toLowerCase().includes(query) || search.title.toUpperCase().includes(query.toUpperCase()))
             
                if(data.length > 0){
                setData(data)
                setLoadData(true);
                setIsLoading(false);
                toast.success(`Search results for ${query} found`)

                }else{
                    setLoadData(false);
                    toast.info(`Search results for ${query} not found`)
                    setIsLoading(false);

                }
              
           })
           .catch(err=>{
               console.log(err.response)
               
           });
        

 
       }, [query])



       let current = localStorage.getItem('online');
       let currentUser = JSON.parse(current);
       let results = Array.from(data);
       console.log(results)
     

        
    return(
                <>
              <Header/> 
              {loadData? 
             <div className="container col-md-4 my-4">
            <h5 className="text-center my-3">Search results for {query} found</h5>
            {isLoading?  <h5 className="text-center my-3">Loading...</h5> : ''}

               {results.map(feature=>{
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
                  :  <h5 className="text-center my-3">Search results for {query} not found</h5>}
               <Footer/>
                  </>
                  )

               }      

        export default SearchResults;