import { useState, useEffect, useRef } from 'react';
import { useKey } from '../hooks/useKey';
import Loader from './Loader.js';
import StarRating from './StarRating';

export default function MovieDetails({
  selectedMovieId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const countRef = useRef(0);
  const KEY = '7950ef59';

  useEffect(
    function () {
      if (userRating) ++countRef.current;
    },
    [userRating]
  );

  const isMovieInWatched = watched.find(
    watchedMovie => watchedMovie.imdbId === selectedMovieId
  );
  const watchedUserRating = watched.find(
    watchedMovie => watchedMovie.imdbId === selectedMovieId
  )?.userRating;

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAddNewWatchedMovie() {
    const newWatchedMovie = {
      imdbId: selectedMovieId,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatchedMovie(newWatchedMovie);
    onCloseMovie();
  }
  useEffect(
    function () {
      const controller = new AbortController();
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setMovie(data);
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.log(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();

      return function () {
        controller.abort();
      };
    },
    [selectedMovieId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = 'usePopcorn';
      };
    },
    [title]
  );

  useKey('watched', onCloseMovie);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isMovieInWatched === undefined ? (
                <>
                  <StarRating
                    size={24}
                    maxRating={10}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={handleAddNewWatchedMovie}
                    >
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated the movie {watchedUserRating}
                  <span>🪅</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
