import React, { useState } from 'react'
import './NewsPage.css'
import Navbar from './Navbar'
import NewsItem from './NewsItem'
import { GET_ALL_NEWS } from '../utils/queries'
import { useQuery } from '@apollo/client'

const NewsPage = () => {
	const [articles, setArticles] = useState([])
	const {
		loading: newsLoading,
		error: newsError,
		refetch,
	} = useQuery(GET_ALL_NEWS, {
		variables: { search: '' },
		fetchPolicy: 'cache-first',
		onCompleted: (data) => {
			setArticles(data.getAllNews)
		},
	})

	const openArticle = (url) => {
		window.open(url, '_blank')
	}

	const isValidArticle = (article) => {
		return (
			article.source !== 'Unknown Source' &&
			article.author !== 'Unknown Author' &&
			article.title !== 'No Title' &&
			article.description !== 'No Description' &&
			article.url &&
			article.urlToImage &&
			article.publishedAt !== '' &&
			article.content !== 'No Content'
		)
	}

	const handleTryAgain = () => refetch()

	if (newsLoading) return <div>Loading...</div>
	if (newsError) return <div>Error fetching news</div>

	const filtered = articles.filter(isValidArticle)
	return (
		<div className="container">
			<Navbar />
			<h1 className="news-feed">News Feed</h1>
			<ul className="news-list">
				{filtered.length === 0 ? (
					<div style={{ background: 'white', color: 'black', textAlign: 'center' }}>
						<p>No articles, please try again</p>
						<button onClick={handleTryAgain}>Get articles</button>
					</div>
				) : (
					filtered.map((article, index) => (
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
					))
				)}
			</ul>
		</div>
	)
}

export default NewsPage
