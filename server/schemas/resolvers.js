// bring in our models and AuthenticationError + token to use in our resolvers logic
const axios = require('axios')
const { User, Game, Post, Comment } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth.js')
const mockGames = require('./mockGames.js')
const mockNews = require('./mockNews.js')
require('dotenv').config()

const { RAWG_API_KEY } = process.env
const resolvers = {
	Query: {
		// parent, args, then context
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id }).select(
					'-__v -password'
				)

				return userData
			}

			throw AuthenticationError
		},

		// gets just the current logged in users post by parent argument and context
		getMyPost: async (_, __, context) => {
			if (!context.user) {
				throw AuthenticationError
			}
			return await Post.find({ author: context.user._id })
		},

		// gets post by parent argument and user
		getPost: async (_, { postId }, context) => {
			if (!context.user) {
				throw AuthenticationError
			}
			return await Post.findById(postId)
		},

		// grabs all posts in db
		getAllPosts: async (_, __, context) => {
			if (!context.user) {
				throw AuthenticationError
			}
			return await Post.find()
		},

		// grabs all comments for a specific post by postDd
		comments: async (_, { postId }, context) => {
			try {
				const comments = await Comment.find({ post: postId }).populate('author')
				return comments
			} catch (error) {
				throw new Error('Failed to fetch comments')
			}
		},

		// returns all games from rawr
		getAllGames: async (_, { search }, context) => {
			try {
				let apiURL = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}`
				if (search.length > 0) {
					apiURL += `&added&page_size=9&search=${search}&search_precise&ordering=-released`
				}
				const response = await axios.get(apiURL)
				// const response = await new Promise((res) => res(mockGames))
				if (response.status !== 200) throw 'Failed to get games'
				const mapped = response.data.results.map((result) => {
					return {
						gameId: result.id || 0,
						name: result.name || 'untitled',
						image: result.background_image || '',
						platforms:
							result.platforms?.map((platform) => platform.platform?.name || '') || [],
						rating: result.rating || 0,
						releaseDate: result.released || '1980-01-01',
					}
				})
				return mapped
			} catch (error) {
				throw new Error('Failed to get games')
			}
		},

		getAllNews: async () => {
			try {
				const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
				const response = await axios.get(url)
				// const response = await new Promise((res) => res(mockNews))

				if (response.status !== 200) throw 'Failed to get news'
				const mapped = response.data.articles.map((result) => {
					return {
						source: result.source?.name || 'Unknown Source',
						author: result.author || 'Unknown Author',
						title: result.title || 'No Title',
						description: result.description || 'No Description',
						url: result.url || '',
						urlToImage: result.urlToImage || '',
						publishedAt: result.publishedAt || '',
						content: result.content || 'No Content',
					}
				})
				return mapped
			} catch (error) {
				throw new Error('Failed to get news')
			}
		},
	},
	Mutation: {
		// add user to db
		addUser: async (_, { username, email, password }) => {
			const user = await User.create({ username, email, password })
			const token = signToken(user)
			return { token, user }
		},
		//logs added user in
		login: async (_, { email, password }) => {
			const user = await User.findOne({ email })

			if (!user) {
				throw AuthenticationError
			}

			const correctPw = await user.isCorrectPassword(password)

			if (!correctPw) {
				throw AuthenticationError
			}
			const { username, _id } = user
			const token = signToken({ username, email, _id })

			return { token, user }
		},

		// logout mutation that still needs to be added to the front end
		logout: async (_, __, context) => {
			if (!context.user) {
				throw AuthenticationError
			}

			return { success: true, message: 'Logged out successfully' }
		},

		//creates a post with title content and current user
		createPost: async (_, { title, content }, context) => {
			if (!context.user) {
				throw AuthenticationError
			}
			const newPost = new Post({
				title,
				content,
				author: context.user._id,
			})
			const savedPost = await newPost.save()
			savedPost.createdAt = savedPost.createdAt.toLocaleString()
			savedPost.updatedAt = savedPost.updatedAt.toLocaleString()
			return savedPost
		},
		updatePost: async (_, { postId, content }, context) => {
			if (!context.user) {
				throw AuthenticationError
			}

			const updatedPost = await Post.findByIdAndUpdate(
				postId,
				{ content, updatedAt: new Date().toISOString() },
				{ new: true }
			)
			if (!updatedPost) {
				throw new Error('Post not found')
			}
			return updatedPost
		},
		// delete a users post
		deletePost: async (_, { postId }) => {
			try {
				const deletedPost = await Post.findByIdAndDelete(postId)

				if (!deletedPost) {
					throw new Error('Post not found')
				}

				return deletedPost
			} catch (error) {
				console.error('Error deleting post:', error)
				throw new Error('Failed to delete post')
			}
		},
		//creates a comment
		createComment: async (_, { content, post }, context) => {
			if (!context.user) {
				throw AuthenticationError
			}
			try {
				const comment = await Comment.create({
					content,
					author: context.user._id,
					post,
				})
				return comment
			} catch (error) {
				throw new Error('Failed to create comment')
			}
		},
		//updates a users comment
		updateComment: async (_, { id, content }, context) => {
			try {
				const updatedComment = await Comment.findByIdAndUpdate(
					id,
					{ content, updatedAt: new Date().toISOString() },
					{ new: true }
				)

				if (!updatedComment) {
					throw new Error('Comment not found')
				}

				return updatedComment
			} catch (error) {
				throw new Error('Failed to update comment')
			}
		},
		// delets a comment by its id
		deleteComment: async (_, { id }, context) => {
			try {
				await Comment.findByIdAndDelete(id)
				return 'Comment deleted successfully'
			} catch (error) {
				throw new Error('Failed to delete comment')
			}
		},
		// add a game to a wishlist
		addToWishlist: async (parent, { gameData }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { wishlist: gameData } },
					{ new: true }
				)

				return updatedUser
			}
		},
		//adds game to currently playing
		addToCurrentlyPlaying: async (parent, { gameData }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { currentlyPlaying: gameData } },
					{ new: true }
				)

				return updatedUser
			}

			throw AuthenticationError
		},
		//deltes from wishlist
		deleteFromWishlist: async (_, { gameId }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $pull: { wishlist: { gameId } } },
					{ new: true }
				)
				return updatedUser
			}
			throw AuthenticationError
		},
		// deletes game from currently playing
		deleteFromCurrentlyPlaying: async (_, { gameId }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $pull: { currentlyPlaying: { gameId } } },
					{ new: true }
				)
				return updatedUser
			}
			throw AuthenticationError
		},
	},
	// grabbing author of comment and post to use in the front end
	Comment: {
		author: async (comment) => {
			return await User.findById(comment.author)
		},
		post: async (comment) => {
			return await Post.findById(comment.post)
		},
	},
	Post: {
		author: async (parent) => {
			return await User.findById(parent.author)
		},
	},
}

module.exports = resolvers
