import React, { useEffect, useState } from 'react';
import './NewsPage.css';
import NewsItem from './NewsItem';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllNews = async () => {
      const apiURL = process.env.NODE_ENV === 'production' ? '/api/news' : 'http://localhost:3001/api/news';

      try {
        const response = await fetch(apiURL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setLoading(false)
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getAllNews();
  }, []);

  const openArticle = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="container">
      <h1 className='news-feed'>News Feed</h1>
      {loading ? <p>Loading</p> :
      <ul className="news-list">
        {articles.map((article, index) => (
          <li key={index} className="article" onClick={() => openArticle(article.url)}>
            <NewsItem
              source={article.source}
              author={article.author}
              title={article.title}
              description={article.description}
              url={article.url}
              urlToImage={article.urlToImage}
              publishedAt={article.publishedAt}
              content={article.content}
            />
          </li>
        ))}
      </ul>
      }
    </div>
  );
};

export default NewsPage;
