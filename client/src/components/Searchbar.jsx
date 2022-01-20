import React, {useState} from 'react';


const Searchbar  = () =>{
 
        const [query, setQuery] = useState('');
      
    let changeQuery = (e) =>{
        setQuery(e.target.value);
    } ;

    let onSubmit = (e) =>{
        e.preventDefault();
        console.log(e)

        window.location.href=`/search/query=${query}`;
    }

      return(
        <form className="my-2 home-form d-none d-lg-inline" onSubmit={onSubmit}>
        <div className="input-group">
            <input type="search" className="form-control lg-search shadow-none" placeholder="Search..."  value={query} onChange={changeQuery} />
            <div className="input-group-append">
                <button className="btn search-btn" ><i className="fa fa-search"></i></button>
                </div>
        </div>
    </form>
      )
}

export default Searchbar;