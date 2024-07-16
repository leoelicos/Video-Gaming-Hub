import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS, QUERY_ME } from '../utils/queries'
import Button from '@mui/material/Button'

// home forum page logic
const ForumPage = () => {
	const { loading, error, data } = useQuery(GET_ALL_POSTS)
	const posts = data?.getAllPosts
	const { loading: meLoading, error: meError, data: meData } = useQuery(QUERY_ME)
	const userData = meData?.me || {}

	if (!userData.username)
		return (
			<div style={{ background: 'white', color: 'black', textAlign: 'center' }}>
				<h1>Please login</h1>
			</div>
		)

	return (
		<div className="content-container">
			<div className="forum-card-container">
				<div className="forum-card">
					<h1 className="threads-header">Game Threads</h1>
					<div className="threads-btns">
						<Button component={Link} to="/create-post" variant="contained">
							Create Post
						</Button>
						<h2
							className="video-game-forum-top"
							style={{
								textAlign: 'center',
								margin: '0 auto',
							}}
						></h2>
						<Button component={Link} to="/user-posts" variant="contained">
							View My Threads
						</Button>
					</div>
					{loading ? (
						<div style={{ background: 'white', color: 'black', textAlign: 'center' }}>
							<p>Loading</p>
						</div>
					) : error ? (
						<p>
							There was an error
							<br />
							<button onClick={() => window.reload()}>Refresh</button>
						</p>
					) : posts.length === 0 ? (
						<p style={{ background: 'white', color: 'black' }}>No blog posts</p>
					) : (
						posts.map((post) => (
							<div className="post" key={post._id}>
								<h2 className="post-title">{post.title}</h2>
								<p className="author">Posted by: {post.author.username}</p>
								<p className="created-at">
									{' '}
									{new Date(parseInt(post.createdAt)).toLocaleDateString()}
								</p>
								<p className="post-content">{post.content}</p>
								<div className="custom-button">
									{/* grabs solo thread */}
									<Button
										className="custom-button"
										variant="contained"
										component={Link}
										to={`/solo-thread/${post._id}`}
									>
										View Thread
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default ForumPage
