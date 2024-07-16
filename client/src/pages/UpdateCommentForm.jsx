import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_COMMENT } from '../utils/mutations'
import Button from '@mui/material/Button'
import '../App.css'

const UpdateCommentForm = ({ comment, onSave, onCancel }) => {
	const [content, setContent] = useState(comment.content)
	const [updateComment] = useMutation(UPDATE_COMMENT)

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await updateComment({
				variables: {
					id: comment.id,
					content,
				},
			})
			onSave(comment.id, content) // Call the onSave function to handle updates
		} catch (error) {
			console.error('Error updating comment:', error)
		}
	}

	const handleContentChange = (e) => {
		setContent(e.target.value)
	}

	return (
		<div className="update-comment-form">
			<form onSubmit={handleSubmit}>
				<label>
					<textarea value={content} onChange={handleContentChange} />
				</label>
				<div className="update-comments">
					<Button type="submit" variant="contained" color="primary">
						Update Comment
					</Button>
					<Button onClick={onCancel} variant="contained" color="secondary">
						Cancel
					</Button>
				</div>
			</form>
		</div>
	)
}

export default UpdateCommentForm
