import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'

// simple update form for updating a post by postId
const UpdatePostForm = ({ post, updatePost }) => {
	const [content, setContent] = useState(post.content)

	const handleContentChange = (event) => {
		setContent(event.target.value)
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		updatePost({ postId: post._id, content })
	}

	return (
		<div>
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
			<div className="content-container">
				<div className="forum-card-container">
					<div className="forum-card">
						<div className="post">
							<h2>Edit Post</h2>
							<form onSubmit={handleSubmit}>
								<label>
									Content:
									<textarea
										className="comment-text-area"
										value={content}
										onChange={handleContentChange}
									/>
								</label>
								<br />
								<Button
									className="update-btn"
									type="submit"
									variant="contained"
									color="primary"
								>
									Update Post
								</Button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UpdatePostForm
