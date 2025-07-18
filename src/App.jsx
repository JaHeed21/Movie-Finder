import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use'; 
import { updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);  
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useDebounce(()=>setDebouncedSearchTerm(searchTerm), 800, [searchTerm]);

  const fetchMovies = async (query='') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      console.log(query)

      // const endpoint = query
      // ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
      // : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc` ;
      
            const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error('Failed to Fetch movies');
      }

      const data = await response.json();
      console.log('data:', data);
      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || [])
      console.log(data.results[0])
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
      // console.log(data)
    } 
    catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassles
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading?
           <Spinner/>
           : errorMessage ? 
            (<p className='text-red-500'>{errorMessage}</p>)
            : (<ul>
              {movieList.map((movie)=>(
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>)
          }
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  );
};

export default App;
