import React, { Fragment, useState, useRef, useCallback } from 'react';
import './App.css';
import useBookSearch from './hooks/useBookSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // console.log('visible');
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <Fragment>
      <div className='container'>
        <h1 className='title'>
          <span>
            <FontAwesomeIcon icon={faCoffee} />
          </span>{' '}
          Coffee Table Book Search
        </h1>
        {/* 🔍  */}
        <input
          className='search'
          type='text'
          value={query}
          placeholder='Add your search term here'
          onChange={handleSearch}
        ></input>
        <div className='result-container'>
          {books.map((book, index) => {
            if (books.length === index + 1) {
              return (
                <div className='result' ref={lastBookElementRef} key={book}>
                  {book}
                </div>
              );
            } else {
              return (
                <div className='result' key={book}>
                  {book}
                </div>
              );
            }
          })}
          <div className='loading'>{loading && 'Loading...'}</div>
          <div className='error'>{error && 'Error'}</div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
