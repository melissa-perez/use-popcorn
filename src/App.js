import { useState } from 'react';
import { useMovies } from './hooks/useMovies';
import { useLocalStorageState } from './hooks/useLocalStorageState';

import Navbar from './components/Navbar';
import Search from './components/Search';
import WatchedSummary from './components/WatchedSummary';
import NumResults from './components/NumResults';
import Main from './components/Main';
import Box from './components/Box';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import WatchedMoviesList from './components/WatchedMoviesList';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [query, setQuery] = useState('');
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  function handleSelectedMovie(movieId) {
    setSelectedMovie(selectedMovie =>
      movieId === selectedMovie ? null : movieId
    );
  }

  function handleCloseMovie() {
    setSelectedMovie(null);
  }

  function handleAddMovieToWatched(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleDeleteMovieInWatched(movieId) {
    setWatched(watched => watched.filter(movie => movie.imdbId !== movieId));
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedMovie ? (
            <MovieDetails
              selectedMovieId={selectedMovie}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddMovieToWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteMovieInWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
