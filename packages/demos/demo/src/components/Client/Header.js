import React from 'react'

export default function ClientHeader({ item }) {
  return (
    <div className="media">
      <div className="media-left">
        <figure className="image is-32x32">
          {typeof item.$imageProgress !== 'undefined'
            ? <progress
                className="progress is-small"
                value={item.$imageProgress}
              >
                {Math.floor(item.$imageProgress * 100)}%
              </progress>
            : item.image && <img src={`${item.image}`} alt="user" />}
        </figure>
      </div>
      <div className="media-content">
        <p className="title is-5">{item.name}</p>
        {item.website &&
          <p className="subtitle is-6">
            <a href={`http://${item.website}`}>{item.website}</a>
          </p>}
      </div>
    </div>
  )
}
