import WatchedMovie from './WatchedMovie';
export default function WatchedMoviesList({ watched, onDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbId}
          onDeleteWatched={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}
