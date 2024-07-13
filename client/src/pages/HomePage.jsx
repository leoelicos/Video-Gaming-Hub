import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './home.css'
import Navbar from './Navbar'
//import ParticlesBackground from './ParticlesBackground';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPlaystation,
	faXbox,
	faWindows,
} from '@fortawesome/free-brands-svg-icons'
import wishlistIcon from '../assets/gift-solid.svg'
import currentlyPlayingIcon from '../assets/gamepad-solid.svg'
import './Profile.css'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { GET_ALL_GAMES, QUERY_ME } from '../utils/queries'
import { ADD_TO_CURRENTLY_PLAYING, ADD_TO_WISHLIST } from '../utils/mutations'

const HomePage = () => {
	const [games, setGames] = useState([])
	const [searchGames, setSearchedGames] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const { loading, data, refetch: refetchMe } = useQuery(QUERY_ME)
	// console.log(data)
	const userData = data?.me || {}

	const { loading: gamesLoading, error: gamesError } = useQuery(GET_ALL_GAMES, {
		variables: { search: '' },
		onCompleted: (data) => {
			setGames(data.getAllGames)
		},
	})

	const [
		searchAllGames,
		{ loading: searchAllGamesLoading, error: searchAllGamesError },
	] = useLazyQuery(GET_ALL_GAMES, {
		onCompleted: (data) => {
			setSearchResults(data.getAllGames)
		},
	})

	const settings = {
		dots: true,
		infinite: true,
		speed: 1000,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 8000,
		pauseOnHover: true,
	}

	// Function to handle searching a game in API
	const handleGameSearch = () =>
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

	const [addToCurrentlyPlaying] = useMutation(ADD_TO_CURRENTLY_PLAYING)

	const handleAddToCurrentlyPlaying = async (gameId) => {
		try {
			if (userData.currentlyPlaying.some((game) => game.gameId === gameId)) return // already in list

			// Find the game object using the gameId
			const game = searchResults.find((game) => game.gameId === gameId)
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

	const [addToWishlist] = useMutation(ADD_TO_WISHLIST)

	const handleAddToWishlist = async (gameId) => {
		try {
			if (userData.wishlist.some((game) => game.gameId === gameId)) return // already in list

			// Find the game object using the gameId
			const game = searchResults.find((game) => game.gameId === gameId)
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
	return (
		<div className="content-container">
			<div className="carousel-container">
				<div className="carousel-wrapper">
					{gamesLoading ? (
						<div style={{ background: 'white', color: 'black', textAlign: 'center' }}>
							<p>Loading</p>
						</div>
					) : gamesError ? (
						<p>
							There was an error
							<br />
							<button onClick={() => window.reload()}>Refresh</button>
						</p>
					) : (
						<Slider {...settings}>
							{games.map((game) => (
								<div className="carousel-item" key={game.name}>
									<img
										className="carousel-image"
										src={game.image}
										alt={game.name}
										style={{ width: '100%', height: 'auto' }}
									/>
									<h3 className="carousel-game-name">{game.name}</h3>
								</div>
							))}
						</Slider>
					)}
				</div>
			</div>
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

export default HomePage
