import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_POST_BY_ID } from '../utils/queries'
import Button from '@mui/material/Button'
import Comments from './Comments'
import CommentForm from './CommentForm'

const SinglePostPage = () => {
	const { postId } = useParams()
	const { loading, error, data } = useQuery(GET_POST_BY_ID, {
		variables: { postId },
	})

	const [showCommentForm, setShowCommentForm] = useState(false)

	if (loading) {
		return <p>Loading...</p>
	}
	if (error) {
		return <p>Error: {error.message}</p>
	}

	const post = data?.getPost

	const handleCommentClick = () => {
		setShowCommentForm((prevState) => !prevState)
	}

	const handleCommentAdded = () => {
		setShowCommentForm(false)
	}

	return (
		<>
			<div className="content-container">
				<h1 className="threads-header">Posted by: {post.author.username}</h1>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '25vh',
					}}
				>
					<Button
						component={Link}
						to="/blog"
						variant="contained"
						color="primary"
						style={{ textDecoration: 'none', color: 'inherit' }}
					>
						Back to Forums
					</Button>
				</div>

				<div className="forum-card-container">
					<div className="forum-card">
						<div className="post">
							<h2 className="post-title">{post.title}</h2>
							<p className="author">Posted by: {post.author.username}</p>
							<p className="created-at">
								{new Date(parseInt(post.createdAt)).toLocaleDateString()}
							</p>
							<p className="post-content">{post.content}</p>
							<Button onClick={handleCommentClick} variant="contained" color="primary">
								Comment
							</Button>
							{showCommentForm && (
								<CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
							)}
							<Comments postId={postId} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default SinglePostPage
