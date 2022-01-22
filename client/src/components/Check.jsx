import React, {useEffect} from 'react';
import axios from 'axios';


const Check = () =>{
        

    let current = localStorage.getItem('online');
    let currentUser = JSON.parse(current);


       
        useEffect(()=>{


            let users={
                loginUsername:currentUser.username,
                photo: currentUser.photo,
            }
              
               
              axios.post('/api/online-users', users)
            .then(res=>{
                console.log(res.data)
                
                
            })
    
            .catch(err=>{
                console.log(err.response)
            })
          
         setTimeout(()=>{
           window.location.href='/';
        }, 3000)

    
    

      

    }, [currentUser.username, currentUser.photo])

    return(
        <>
        <h5 className="text-center mt-4">Please wait....</h5>
        <p className="text-center">Verifying user info</p>
        </>
    )
}




export default Check;