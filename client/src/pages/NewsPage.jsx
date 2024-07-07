import React, { useEffect, useState } from 'react';
import './NewsPage.css';
import Navbar from './Navbar';
import { useQuery, gql } from '@apollo/client';

const GET_NEWS = gql`
    query GetNews {
        getNews {
            source
            author
            title
            description
            url
            urlToImage
            publishedAt
            content
        }
    }
`;

const NewsPage = () => {
  const { loading, error, data } = useQuery(GET_NEWS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const articles = data.getNews;

  const openArticle = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="container">
      <Navbar />
      <h1 className='news-feed'>News Feed</h1>
      <ul className="news-list">
        {articles.map((article, index) => (
          <li key={index} className="article" onClick={() => openArticle(article.url)}>
            <div className="article-content">
              <h2 className="title">{article.title}</h2>
              <div className='description-item'>
                {article.urlToImage && <img src={article.urlToImage} alt={article.title} className="image" />}
                <p className="description">{article.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsPage;