import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_USER_POSTS } from '../utils/queries'
import { DELETE_POST, UPDATE_POST } from '../utils/mutations'
import Button from '@mui/material/Button'
import UpdatePostForm from './UpdatePostForm'

// grabs post of specific users post by using the GET_USER_POSTS front and back end query
const UserPostPage = () => {
	const [deletePost] = useMutation(DELETE_POST, {
		update(cache, { data: { deletePost } }) {
			const { getMyPost } = cache.readQuery({ query: GET_USER_POSTS })
			const updatedPosts = getMyPost.filter((post) => post._id !== deletePost._id)
			cache.writeQuery({
				query: GET_USER_POSTS,
				data: { getMyPost: updatedPosts },
			})
		},
	})
	// logic for handling the updated cashe and single post query
	const [updatePost] = useMutation(UPDATE_POST, {
		update(cache, { data: { updatePost } }) {
			const { getMyPost } = cache.readQuery({ query: GET_USER_POSTS })
			const updatedPosts = getMyPost.map((post) =>
				post._id === updatePost._id ? updatePost : post
			)
			cache.writeQuery({
				query: GET_USER_POSTS,
				data: { getMyPost: updatedPosts },
			})
		},
	})

	const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)
	const [selectedPost, setSelectedPost] = useState(null)

	// handles the delete for user posts
	const handleDelete = async (postId) => {
		try {
			await deletePost({
				variables: { postId },
			})
		} catch (error) {
			console.error('Error deleting post:', error)
		}
	}

	const handleUpdate = (post) => {
		setSelectedPost(post)
		setIsUpdateFormOpen(true)
	}

	const { loading, error, data } = useQuery(GET_USER_POSTS)

	return (
		<div className="forum-card-container">
			<div className="forum-card">
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
				) : data.getMyPost.length === 0 ? (
					<p style={{ background: 'white', color: 'black' }}>No blog posts</p>
				) : (
				data.getMyPost.map((post) => (
					<div className="post" key={post._id}>
						<h2 className="post-title">{post.title}</h2>
						<p className="post-content">{post.content}</p>
						<p className="author">Author: {post.author.username}</p>
						<p className="created-at">
							Created At: {new Date(parseInt(post.createdAt)).toLocaleDateString()}
						</p>
						<div className="button-group">
							<Button
								className="post-update-button"
								onClick={() => handleUpdate(post)}
							>
								Update
							</Button>
							<Button
								className="post-delete-button"
								onClick={() => handleDelete(post._id)}
							>
								Delete
							</Button>
							{isUpdateFormOpen && selectedPost && selectedPost._id === post._id && (
								<UpdatePostForm
									post={selectedPost}
									updatePost={(updatedPost) => {
										updatePost({ variables: updatedPost })
										setIsUpdateFormOpen(false)
									}}
								/>
							)}
						</div>
					</div>
				)
				))}
			</div>
		</div>
	)
}

export default UserPostPage
