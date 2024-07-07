import React from 'react';

const NewsItem = ({ source, author, title, description, url, urlToImage, publishedAt, content }) => {
    return (
        <div className='news-item'>
            <h2>{title}</h2>
            <p><strong>Author:</strong> {author}</p>
            <p><strong>Source:</strong> {source.name}</p>
            {urlToImage && <img
                src={urlToImage}
                alt={title}
                style={{ width: '100%', height: 'auto' }}
            />}
            <p>{description}</p>
            <a href={url} target="_blank" rel="noopener noreferrer">Read more</a>
            <p><strong>Published at:</strong> {new Date(publishedAt).toLocaleString()}</p>
            <p>{content}</p>
        </div>
    );
};

export default NewsItem;
