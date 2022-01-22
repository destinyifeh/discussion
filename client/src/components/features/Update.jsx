import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import axios from 'axios';
function Update(){

             const [title, setTitle] = useState('');
             const [description, setDescription] = useState('');
             const [editImage, setEditImage] = useState('');
             //const [data, setData] = useState('');
             const [loadData, setLoadData] = useState(false);
             const [image, setImage] = useState('');


             let {slug} = useParams();
             console.log(slug)

             let changeTitle = (e) =>{
                 setTitle(e.target.value);
             };

             let changeDescription = (e) =>{
                setDescription(e.target.value);
            };

            let changeImage = (e) =>{
                if(maxSelectFile(e) && checkFileSize(e) && checkMimeType(e)){
        
                 let image = e.target.files[0];
                 setImage(image);
                 console.log(image)
                }
            };
                               
//Single upload image functions//

let maxSelectFile=(e)=>{
    let file = e.target.files[0] // create file object
        if (file.length > 1) { 
           const msg = 'Only 1 images can be uploaded at a time'
           toast.error('Only 1 images can be uploaded at a time')
           e.target.value = null // discard selected file
           console.log(msg)
          return false;
 
      }
    return true;
 
 }


 let checkMimeType=(e)=>{
    //getting file object
    let file = e.target.files[0]; 
    //define message container
    let err = ''
    // list allow mime type
   const types = ['image/png', 'image/jpg', 'image/jpeg']
    // loop access array
    
     // compare file type find doesn't matach
     //eslint-disable-next-line
         if (types.every(type => file.type !== type)) {
         // create error message and assign to container   
         err += file.type+' is not a supported format\n';
         toast.error( file.type+' is not a supported format\n')
       }
     
  
   if (err !== '') { // if message not same old that mean has error 
        e.target.value = null // discard selected file
        console.log(err)
         return false; 
    }
   return true;
  
  }

  let checkFileSize=(e)=>{
    let file = e.target.files[0];
    let size = 1000000  //1mb 
    let err = ""; 
    if (file.size > size) {
     err += file.type+'is too large, please pick a smaller file\n';
     toast.error('Image is too large, please pick a smaller file')
   
 };
 if (err !== '') {
    e.target.value = null
    console.log(err)
    return false
}

return true;

};


           let onSubmit = (e) =>{
              
            e.preventDefault();
        
              let data = new FormData();
              data.append('image', image)
              console.log(image)
              data.append('title', title)
              data.append('description', description)
            
             if(!title || !description){
               let err = 'You can not submit empty form';
               console.log(err);
               toast.error('You can not submit empty form');
               return false;
             }else{
                 axios.put('/api/update/feature/'+slug, data)
                 .then(res=>{
                     console.log(res.data)
                     toast.success('Updated');

                      setTimeout(()=>{
                    window.location.href='/user/features';
                      }, 2000)
                       
                 })
                 .catch(err=>{
                     console.log(err.response)
                     toast.error('An error occur, try again')
                 })
                 
                 return true;
             }

          };

          useEffect(()=>{
                axios.get('/api/edit/feature/'+slug)
                .then(res=>{
                    console.log(res.data);
                    setTitle(res.data.title);
                    setDescription(res.data.description);
                    setEditImage(res.data.image);
                    setLoadData(true);
                })
                .catch(err=>{
                    console.log(err.response)
                    
                });

                 
               

           }, [slug])

             
            
    return(
           
        <div className="container-fluid login">
           <h5 className="pt-4 text-center text-white ">Discussion</h5>
           <p className="text-center text-white"> Update Post</p>
           {loadData ? '' : <h5 className="loader text-center">Loading ... </h5>}
           <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={onSubmit}>
               <div className="form-group">
               <label className="text-white" >Title</label>

                   <input className="form-control login-control" type="text" placeholder="enter email" value={title} onChange={changeTitle} />
               </div>
               <img className="img-thumbnail my-3 d-block mx-auto" style={{width: "150px", height:"150px"}} src={editImage} alt=" "/>

               <div className="form-group mt-3">
               <label className="text-white" >Change Image</label>

                   <input className="form-control login-control" type="file" defaultValue={image} onChange={changeImage} />
               </div>
               <div className="form-group mt-3">
               <label className="text-white" >Description</label>

                   <textarea className="form-control" placeholder="description..." value={description} onChange={changeDescription} />
               </div>
               <div className="form-group mt-3">
                   <button className="btn login-btn">Update Post</button>
               </div>
           </form>
           <div className="d-flex justify-content-between my-2 col-lg-6 mx-lg-auto">
           <Link className=" text-white login-link" to="/">Home</Link>

           <Link className=" text-white login-link " to="/">Profile</Link>

           </div>

        </div>
    )
}


export default Update;