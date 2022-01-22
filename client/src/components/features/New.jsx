import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
function New(){

    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
     const [posting, setPosting] = useState(false);    
    let current = localStorage.getItem('online');
    let currentUser = JSON.parse(current);

    let changeImage = (e) =>{
        if(maxSelectFile(e) && checkFileSize(e) && checkMimeType(e)){

         let image = e.target.files[0];
         setImage(image);
         console.log(image)
        }
    };


    let changeTitle=(e)=>{

        let title = e.target.value;
        console.log(title)
        setTitle(title)
    };


    
    let changeDescription=(e)=>{
        let detail = e.target.value;
        console.log(detail)
        setDescription(detail)
    };

            
//upload image functions//

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

}

          let submitFeature=(e)=>{
              e.preventDefault();
                
                setPosting(true);

               let username = currentUser.username;
               let photo = currentUser.photo;
              let data = new FormData();
              data.append('image', image)
              console.log(image)
              data.append('title', title)
              data.append('description', description)
              data.append('username', username)
              data.append('photo', photo)
            
             if(!image || !title || !description){
               let err = 'You can not submit empty form';
               console.log(err);
               toast.error('You can not submit empty form');
               return false;
             }else{
                 axios.post('/api/feature/new', data)
                 .then(res=>{
                     console.log(res.data);
                     setTitle('');
                     setDescription('');
                     setImage('');
                     setPosting(false);
                    toast.success('Posted');
                    setTimeout(()=>{
                       window.location.href='/';
                    }, 2000)
                 
                 })
                 .catch(err=>{
                     console.log(err.response);
                     toast.error('An error occur, try again');
                     setPosting(false);
                 })
                 
                 return true;
             }

          }

    return(
           
        <div className="container-fluid login">
           <h5 className="pt-4 text-center text-white ">Discussion</h5>
           <p className="text-center text-white"> Create Post</p>
                {posting?  <p className="text-center text-white"> Posting... </p> : ' '}
           <form className="login-form col-lg-6 mx-lg-auto mt-5" onSubmit={submitFeature}>
               <div className="form-group">
               <label className="text-white" >Title</label>

                   <input className="form-control login-control" type="text" placeholder="enter title" value={title} onChange={changeTitle} />
               </div>
               <div className="form-group mt-3">
               <label className="text-white" >Add Image</label>

                   <input className="form-control login-control" type="file"  defaultValue={image} onChange={changeImage} />
               </div>
               <div className="form-group mt-3">
               <label className="text-white" >Description</label>

                   <textarea className="form-control" placeholder="description..." value={description} onChange={changeDescription} />
               </div>
               <div className="form-group mt-3">
                   <button className="btn login-btn" type="submit">Create</button>
               </div>
           </form>
           <div className="d-flex justify-content-between my-2 col-lg-6 mx-lg-auto">
           <Link className=" text-white login-link" to="/">Home</Link>

           <Link className=" text-white login-link " to={`/user/${currentUser.username}`}>Profile</Link>

           </div>

        </div>
    )
}


export default New;