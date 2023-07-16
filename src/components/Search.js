import { useRef, useEffect } from 'react';

export default function Search({ query, setQuery }) {
  const searchElement = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === searchElement.current) return;
        if (e.code === 'Enter') {
          searchElement.current.focus();
          setQuery('');
        }
      }
      document.addEventListener('keydown', callback);
      return () => document.removeEventListener('keydown', callback);
    },
    [setQuery]
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      ref={searchElement}
    />
  );
}
