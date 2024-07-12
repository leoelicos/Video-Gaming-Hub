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

// import { getAllGames } from '../utils/API'

const HomePage = () => {
	const [games, setGames] = useState([])
	const [searchGames, setSearchedGames] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const { loading, data, refetch: refetchMe } = useQuery(GET_ME)

	useEffect(() => {
		const init = async () => {
			try {
				const response = await getAllGames()
				setGames(response)
			} catch (error) {
				setSearchError(true)
				console.error('Error fetching data:', error)
			}
		}

		init()
	}, [])

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
	const handleGameSearch = async () => {
		try {
			const results = await getAllGames(searchGames)
			setSearchResults(results)
		} catch (error) {
			console.error('Error searching game', error)
		}
	}

	// Function to turn platform names into images
	const getPlatformIcons = (platforms) => {
		// Check if platforms is defined and is an array
		if (Array.isArray(platforms)) {
			return platforms.map((platformData, index) => {
				// Access the platform name from the nested object
				const platformName = platformData.platform.name

				let icon = null
				switch (platformName) {
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
				return <span key={index}>{icon}</span>
			})
		}
		// Return an empty array or a default value if platforms is not an array
		return []
	}

	return (
		<div className="content-container">
			<Navbar />
			<div className="carousel-container">
				<div className="carousel-wrapper">
					{searchError ? (
						<p>
							There was an error{' '}
							<button onClick={() => window.reload()}>Refresh</button>
						</p>
					) : (
						<Slider {...settings}>
							{games.map((game) => (
								<div className="carousel-item" key={game.id}>
									<img
										className="carousel-image"
										src={game.background_image}
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
					{searchResults.map((game) => (
						<div className="col-lg-5 col-md-6 col-sm-12" key={game.id}>
							<div className="item">
								<div className="image-container">
									<img
										className="game-image"
										src={game.background_image}
										alt={game.name}
										style={{ width: '100%', height: 'auto' }}
									/>
									<div className="overlay">
										<h3 className="game-name">{game.name}</h3>
										<p className="platforms">{getPlatformIcons(game.parent_platforms)}</p>
										<div className="rating-container">
											<p className="rating-label">Rating:</p>
											<p className="rating">⭐️{game.rating}</p>
										</div>
										<div className="released-container">
											<p className="released-label">Released:</p>
											<p className="released">{game.released}</p>
										</div>
										<div className="button-container">
											<img
												src={wishlistIcon}
												alt="Add to Wishlist"
												onClick={() => handleAddToWishlist(game.id)}
												className="wishlist-button"
												style={{ cursor: 'pointer' }}
											/>
											<img
												src={currentlyPlayingIcon}
												alt="Currently Playing"
												onClick={() => handleAddToCurrentlyPlaying(game.id)}
												className="currently-playing-button"
												style={{ cursor: 'pointer' }}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default HomePage
