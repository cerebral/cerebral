import React from 'react'

function Search (props) {
  return (
    <div className='docs-search'>
      <input id='search-docs' autoFocus type='text' placeholder='search...' />
      <div id='search-result' className='docs-search-result' />
    </div>
  )
}

export default Search
