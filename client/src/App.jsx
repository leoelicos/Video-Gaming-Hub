import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
	HttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import 'bootstrap/dist/css/bootstrap.min.css'
import HomePage from './pages/HomePage'
import { FaGamepad } from 'react-icons/fa'
import Navbar from './pages/Navbar'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import AuthService from './utils/auth.js'

const httpLink = createHttpLink({ uri: '/graphql' })
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('id_token')
	return {
		headers: {
			...headers,
			authorization: token ? `token holder ${token}` : '',
		},
	}
})
const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
})

const Backdrop = ({ onClick }) => {
	return <div className="backdrop" onClick={onClick}></div>
}

function App() {
	const [showLogin, setShowLogin] = useState(false)
	const [showSignUp, setShowSignUp] = useState(false)
	const [isSignUpMode, setIsSignUpMode] = useState(false)

	const handleShowLogin = () => {
		setShowLogin(true)
		setIsSignUpMode(false)
	}

	const handleCloseLogin = () => {
		setShowLogin(false)
	}

	const handleCloseSignUp = () => {
		setShowSignUp(false)
	}

	const handleSignUpLinkClick = () => {
		setShowLogin(false) // Close the login modal
		setIsSignUpMode(true) // Set signup mode to true
		setShowSignUp(true) // Show the signup modal
	}

	const handleLogout = () => {
		AuthService.logout()
	}

	const isLoggedIn = AuthService.loggedIn()

	return (
		<>
			<ApolloProvider client={client}>
				<div className="app-wrapper">
					<header className="app-header">
						<Navbar />
						<div style={{ flex: '1' }}></div>
						<div
							style={{
								flex: '1',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div className="app-logo">
								<FaGamepad />
							</div>
							<h1 className="app-title">VGH</h1>
						</div>
						<div
							style={{
								flex: '1',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
								paddingRight: '10px',
							}}
						>
							{isLoggedIn ? (
								<button className="logout-button" onClick={handleLogout}>
									Logout
								</button>
							) : (
								<button className="login-button" onClick={handleShowLogin}>
									Login
								</button>
							)}
						</div>
					</header>
					<div className="app-container">
						<Outlet />
						{showLogin && (
							<>
								<Backdrop onClick={handleCloseLogin} />
								<div className="login-overlay">
									<div className="login-modal">
										<Login onClose={handleCloseLogin} />
										{!isSignUpMode && (
											<p className="signup-link" onClick={handleSignUpLinkClick}>
												Don't have an account? Click here!
											</p>
										)}
									</div>
								</div>
							</>
						)}
						{showSignUp && (
							<>
								<Backdrop onClick={handleCloseSignUp} />
								<div className="signup-overlay">
									<div className="signup-modal">
										<SignUp onClose={handleCloseSignUp} />
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</ApolloProvider>
		</>
	)
}

export default App
