import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import Header from './Header';

const Report = () =>{

    const [report, setReport] = useState('');
    const [reportSending, setReportSending] = useState(false);

    
let current = localStorage.getItem('online');
let currentUser = JSON.parse(current);


const {title} = useParams();


    useEffect(()=>{
 
        setReport(title);

    }, [title])

    let changeReport = (e) =>{

        setReport(e.target.value);
       };

      let submitReport = (e) =>{
          e.preventDefault();
          
          setReportSending(true);

          let reports = {
                report: report,
                reporter_name: currentUser.username,
                reporter_email: currentUser.email
          }
          console.log(reports);

            axios.post('/api/feature/report', reports)
            .then(res=>{
                console.log(res.data)
                setReportSending(false);
                toast.success('Post reported. Thanks');

                setTimeout(()=>{
                    window.location.href='/';
                }, 2000)
            })
            .catch(err=>{
                console.log(err.response)
                setReportSending(false);
               toast.error('An error occur, try again')
            })
      };



      let handleClick = (e) =>{
          e.preventDefault();
      };

    return(

        <>
        <Header/>
        <div className="container col-sm-6 my-4">
            {reportSending?<p className="text-center">Sending report...</p> : ' '}
         <form className=" mx-auto" onSubmit={submitReport}>
             <label>Post Title</label>
             <div className="form-group">
         <input className="form-control" type="text" onChange={changeReport} value={report} onMouseDown={handleClick} />
         </div>
         <h5 className="text-center mt-3">Are sure you want to report this post ?</h5>

         <div className="form-group d-flex justify-content-around">
         <Link className="btn mt-3 report-btn" to='/' >Cancel</Link>

          <button className="btn  mt-3 report-btn " type="submit">Report Post</button>
          </div>
         </form>  
         </div>          
        </>
    )
}


export default Report;