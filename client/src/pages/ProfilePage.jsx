import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPlaystation,
	faXbox,
	faWindows,
} from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import { ADD_TO_WISHLIST } from '../utils/mutations'
import {
	ADD_TO_CURRENTLY_PLAYING,
	REMOVE_FROM_CURRENTLY_PLAYING,
	REMOVE_FROM_WISHLIST,
} from '../utils/mutations'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_ALL_GAMES, QUERY_ME } from '../utils/queries'
import AuthService from '../utils/auth'
import './Profile.css'

import { useMutation } from '@apollo/client'
import wishlistIcon from '../assets/gift-solid.svg'
import currentlyPlayingIcon from '../assets/gamepad-solid.svg'

// Profile page function
const ProfilePage = () => {
	const [searchGames, setSearchedGames] = useState('') // State to hold the searched games
	const [searchResults, setSearchResults] = useState([]) // State to hold the search results
	const [wishlist, setWishlist] = useState([]) // State to hold the wishlist
	const [currentlyPlaying, setCurrentlyPlaying] = useState([]) // State to hold the currently playing games
	const [userId, setUserId] = useState(null) // State to hold the user ID
	const { loading, data, refetch: refetchMe } = useQuery(QUERY_ME) // Query to get the user data
	const userData = data?.me || {}

	// Function to handle searching a game in API
	const [
		searchAllGames,
		{ loading: searchAllGamesLoading, error: searchAllGamesError },
	] = useLazyQuery(GET_ALL_GAMES, {
		fetchPolicy: 'cache-first',
		onCompleted: (data) => {
			setSearchResults(data.getAllGames)
		},
	})
	const handleGameSearch = async () =>
		searchAllGames({ variables: { search: searchGames } })

	// Function to turn platform names into images
	const getPlatformIcons = (platforms) =>
		platforms.map((platform) => {
			let icon = null
			switch (platform) {
				case 'PlayStation':
					icon = <FontAwesomeIcon icon={faPlaystation} />
					break
				case 'Xbox':
					icon = <FontAwesomeIcon icon={faXbox} />
					break
				case 'PC':
					icon = <FontAwesomeIcon icon={faWindows} />
					break
				default:
					icon = null
			}
			return <span key={platform}>{icon}</span>
		})

	const [addToWishlist] = useMutation(ADD_TO_WISHLIST)

	const handleAddToWishlist = async (gameId) => {
		try {
			if (userData.wishlist.some((game) => game.gameId === gameId)) return // already in list

			// Find the game object using the gameId
			const game = searchResults.find((game) => game.gameId === gameId)
			console.log(game.name)
			if (!game) {
				throw new Error('Game not found')
			}

			const input = {
				gameId: game.gameId.toString(), // Convert gameId to a string
				name: game.name,
				image: game.image,
				platforms: game.platforms,
				rating: game.rating,
				releaseDate: game.released,
			}

			// Call the addToWishlist mutation with the correct variable name
			await addToWishlist({
				variables: {
					gameData: input,
				},
			})

			refetchMe()
		} catch (error) {
			console.error('Error adding to wishlist:', error)
		}
	}

	const [addToCurrentlyPlaying] = useMutation(ADD_TO_CURRENTLY_PLAYING)

	const handleAddToCurrentlyPlaying = async (gameId) => {
		try {
			if (userData.currentlyPlaying.some((game) => game.gameId === gameId)) return // already in list

			// Find the game object using the gameId
			const game = searchResults.find((game) => game.gameId === gameId)
			console.log(game.gameId)
			if (!game) {
				throw new Error('Game not found')
			}

			const input = {
				gameId: game.gameId.toString(), // Convert gameId to a string
				name: game.name,
				image: game.image,
				platforms: game.platforms,
				rating: game.rating,
				releaseDate: game.released,
			}

			// Call the addToWishlist mutation with the correct variable name
			await addToCurrentlyPlaying({ variables: { gameData: input } })
			refetchMe()

			// setWishlist(prevState => [...prevState, data.addToWishlist]);
		} catch (error) {
			console.error('Error adding to currently playing:', error)
		}
	}

	// Function to handle removing a game from the wishlist
	const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST)
	const handleRemoveFromWishlist = async (gameId) => {
		if (userData.wishlist.find((game) => game.gameId === gameId) === null) return // not in list

		try {
			await removeFromWishlist({ variables: { gameId } })
			refetchMe()
		} catch (error) {
			console.error('Error removing from wishlist:', error)
		}
	}

	const [removeFromCurrentlyPlaying] = useMutation(REMOVE_FROM_CURRENTLY_PLAYING)
	const handleRemoveFromCurrentlyPlaying = async (gameId) => {
		if (userData.currentlyPlaying.find((game) => game.gameId === gameId) === null)
			return // not in list
		try {
			await removeFromCurrentlyPlaying({ variables: { gameId } })
			refetchMe()
		} catch (error) {
			console.error('Error adding to currently playing:', error)
		}
	}

	if (!userData.username)
		return (
			<div style={{ background: 'white', color: 'black', textAlign: 'center' }}>
				<p>Please login</p>
			</div>
		)

	return (
		<div className="container">
			<header className="my-4">
				<h1 className="username-title">Welcome, {userData.username}!</h1>
			</header>

			<div className="row">
				<div className="my-4">
					<h2 className="currently-playing-title">
						Currently Playing
						<span className="icon">
							<img className="icon-image" src={currentlyPlayingIcon} alt="Icon" />
						</span>
					</h2>

					<div className="container">
						<div className="row">
							{userData.currentlyPlaying?.length === 0 ? (
								<p style={{ background: 'white', color: 'black' }}>
									Currently Playing list is empty
								</p>
							) : (
								userData.currentlyPlaying?.map((game) => (
									<div className="col-lg-5 col-md-8 col-sm-12" key={game.name}>
										<div className="item">
											<div className="image-container">
												<img
													className="game-image"
													src={game.image}
													alt={game.name}
													style={{ width: '100%', height: 'auto' }}
												/>
												<div className="overlay">
													<h3 className="game-name">{game.name}</h3>
													<p className="platforms">{getPlatformIcons(game.platforms)}</p>
													<div className="rating-container">
														<p className="rating-label">Rating:</p>
														<p className="rating">⭐️{game.rating}</p>
													</div>
													<div className="released-container">
														<p className="released-label">Released:</p>
														<p className="released">{game.releaseDate}</p>
													</div>
													<div className="button-container">
														<img
															src={wishlistIcon}
															alt="Add to Wishlist"
															onClick={() => handleAddToWishlist(game.gameId)}
															className="wishlist-button"
															style={{ cursor: 'pointer' }}
														/>
														<img
															src={currentlyPlayingIcon}
															alt="Currently Playing"
															onClick={() => handleRemoveFromCurrentlyPlaying(game.gameId)}
															className="currently-playing-button"
															style={{ cursor: 'pointer' }}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>

			<section className="my-4">
				<h2 className="wishlist-title">
					Wishlist
					<span className="icon">
						<img className="icon-image-2" src={wishlistIcon} alt="Icon" />
					</span>
				</h2>
				<div className="container">
					<div className="row">
						{userData.wishlist?.length === 0 ? (
							<p style={{ background: 'white', color: 'black' }}>Wishlist is empty</p>
						) : (
							userData.wishlist?.map((game) => (
								<div className="col-lg-5 col-md-8 col-sm-12" key={game.name}>
									<div className="item">
										<div className="image-container">
											<img
												className="game-image"
												src={game.image}
												alt={game.name}
												style={{ width: '100%', height: 'auto' }}
											/>
											<div className="overlay">
												<h3 className="game-name">{game.name}</h3>
												<p className="platforms">{getPlatformIcons(game.platforms)}</p>
												<div className="rating-container">
													<p className="rating-label">Rating:</p>
													<p className="rating">⭐️{game.rating}</p>
												</div>
												<div className="released-container">
													<p className="released-label">Released:</p>
													<p className="released">{game.releaseDate}</p>
												</div>
												<div className="button-container">
													<img
														src={wishlistIcon}
														alt="Add to Wishlist"
														onClick={() => handleRemoveFromWishlist(game.gameId)}
														className="wishlist-button"
														style={{ cursor: 'pointer' }}
													/>
													<img
														src={currentlyPlayingIcon}
														alt="Currently Playing"
														onClick={() => handleAddToCurrentlyPlaying(game.gameId)}
														className="currently-playing-button"
														style={{ cursor: 'pointer' }}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</section>
			{/* Search Bar */}
			<div className="input-group mb-3 search-group">
				<input
					className="search-bar"
					type="text"
					placeholder="Search for games..."
					value={searchGames}
					onChange={(e) => setSearchedGames(e.target.value)}
				/>
				<button className="search-button" onClick={handleGameSearch}>
					Search
				</button>
			</div>
			<div className="container">
				<div className="row">
					{searchAllGamesLoading ? (
						<div style={{ background: 'white', color: 'black', textAlign: 'center' }}>
							<p>Loading</p>
						</div>
					) : searchAllGamesError ? (
						<p>
							There was an error
							<br />
							<button onClick={() => window.reload()}>Refresh</button>
						</p>
					) : (
						searchResults.map((game) => (
							<div className="col-lg-5 col-md-6 col-sm-12" key={game.name}>
								<div className="item">
									<div className="image-container">
										<img
											className="game-image"
											src={game.image}
											alt={game.name}
											style={{ width: '100%', height: 'auto' }}
										/>
										<div className="overlay">
											<h3 className="game-name">{game.name}</h3>
											<p className="platforms">{getPlatformIcons(game.platforms)}</p>
											<div className="rating-container">
												<p className="rating-label">Rating:</p>
												<p className="rating">⭐️{game.rating}</p>
											</div>
											<div className="released-container">
												<p className="released-label">Released:</p>
												<p className="released">{game.releaseDate}</p>
											</div>
											<div className="button-container">
												<img
													src={wishlistIcon}
													alt="Add to Wishlist"
													onClick={() => handleAddToWishlist(game.gameId)}
													className="wishlist-button"
													style={{ cursor: 'pointer' }}
												/>
												<img
													src={currentlyPlayingIcon}
													alt="Currently Playing"
													onClick={() => handleAddToCurrentlyPlaying(game.gameId)}
													className="currently-playing-button"
													style={{ cursor: 'pointer' }}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default ProfilePage
