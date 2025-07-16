import React from 'react'

const Search = ({searchTerm, setSearhTerm}) => {
      
  return (
    
    <div className='search'>
        <div>
            <img src="./search.svg" alt="search" />
            <input type="text"
            placeholder='Search through all the movies'
            value={searchTerm}
            onChange={ (e)=> setSearhTerm(e.target.value)} />
        </div>
    </div>
  )
}

export default Search