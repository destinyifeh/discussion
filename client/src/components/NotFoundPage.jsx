import {Link} from 'react-router-dom';
function NotFoundPage(){
     
    

        return(

            <div className="container my-5">
                <h1 className="">404</h1>
                 <h5 className="">Oops! This Page Could Not Be Found</h5>
    <p>Sorry the page you are looking for does not exist or have been removed, name changed or is temporary unavailable.</p>
    <Link to="/"><h5 className="">Back To Home</h5></Link>

            </div>
        )
    
}

export default NotFoundPage;