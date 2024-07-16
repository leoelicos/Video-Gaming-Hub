import React, { useEffect, useState } from 'react'
import './NewsPage.css'
import Navbar from './Navbar'
import NewsItem from './NewsItem'
import { GET_ALL_NEWS } from '../utils/queries'
import { useQuery } from '@apollo/client'

const NewsPage = () => {
	const [articles, setArticles] = useState([])
	const { loading: newsLoading, error: newsError } = useQuery(GET_ALL_NEWS, {
		variables: { search: '' },
		fetchPolicy: 'cache-first',
		onCompleted: (data) => {
			setArticles(data.getAllNews)
		},
	})

	const openArticle = (url) => {
		window.open(url, '_blank')
	}

	return (
		<div className="container">
			<h1 className="news-feed">News Feed</h1>
			<ul className="news-list">
				{articles.map((article, index) => (
					<li
						key={index}
						className="article"
						onClick={() => openArticle(article.url)}
					>
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
		</div>
	)
}

export default NewsPage
