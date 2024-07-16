import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_COMMENT } from '../utils/mutations'
import Button from '@mui/material/Button'

// update comment form that can be re used through the app
const UpdateCommentForm = ({ comment, onSave }) => {
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
			onSave(comment.id, content) // Call the onSave function to close the form
		} catch (error) {
			console.error('Error updating comment:', error)
		}
	}

	const handleContentChange = (e) => {
		setContent(e.target.value)
	}

	// returns value of new content and submits update
	return (
		<form onSubmit={handleSubmit}>
			<label>
				Comment:
				<textarea value={content} onChange={handleContentChange} />
			</label>
			<Button type="submit" variant="contained" color="primary">
				Update Comment
			</Button>
		</form>
	)
}

export default UpdateCommentForm
