import { gql } from '@apollo/client'

// queries tested on backend sandbox
export const GET_USER_BY_ID = gql`
	query GetUserById($id: ID!) {
		getUserById(id: $id) {
			_id
			username
			email
			bio
			wishlist {
				_id
				name
				gameId
				image
				platforms
				rating
				releaseDate
			}
		}
	}
`

export const GET_POST_BY_ID = gql`
	query GetPostById($postId: ID!) {
		getPost(postId: $postId) {
			_id
			title
			content
			author {
				_id
				username
			}
			createdAt
			updatedAt
		}
	}
`

export const QUERY_ME = gql`
	{
		me {
			_id
			email
			username
			wishlist {
				gameId
				name
				image
				platforms
				rating
				releaseDate
			}
			currentlyPlaying {
				gameId
				name
				image
				platforms
				rating
				releaseDate
			}
		}
	}
`

export const GET_ALL_POSTS = gql`
	query GetAllPosts {
		getAllPosts {
			_id
			title
			content
			author {
				username
			}
			createdAt
			updatedAt
		}
	}
`

export const GET_USER_POSTS = gql`
	query GetMyPost {
		getMyPost {
			_id
			author {
				_id
				email
				username
			}
			content
			createdAt
			title
		}
	}
`

export const GET_COMMENTS = gql`
	query GetComments($postId: ID!) {
		comments(postId: $postId) {
			author {
				_id
				email
				username
			}
			content
			createdAt
			id
			post {
				_id
				author {
					_id
					email
					username
				}
				content
				createdAt
				title
			}
		}
	}
`

export const GET_ALL_GAMES = gql`
	query GetAllGames($search: String) {
		getAllGames(search: $search) {
			gameId
			name
			image
			platforms
			rating
			releaseDate
		}
	}
`

export const GET_ALL_NEWS = gql`
	query Query {
		getAllNews {
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
`