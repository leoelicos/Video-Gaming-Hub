import { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Backdrop = ({ onClick }) => {
	return <div className="backdrop" onClick={onClick}></div>
}

const RootWrapper = ({ children }) => {
	const [showLogin, setShowLogin] = useState(false)
	const [showSignUp, setShowSignUp] = useState(false)
	const [isSignUpMode, setIsSignUpMode] = useState(false)
	const [showNotification, setShowNotification] = useState(false)

	const handleShowLogin = () => {
		setShowLogin(true)
		setIsSignUpMode(false)
	}

	const handleCloseLogin = () => {
		setShowLogin(false)
	}

	const handleShowSignUp = () => {
		setShowSignUp(true)
	}

	const handleCloseSignUp = () => {
		setShowSignUp(false)
	}

	const handleSignUpLinkClick = () => {
		setShowLogin(false) // Close login modal
		setIsSignUpMode(true) // Set sign up mode
		setShowSignUp(true) // Open sign up modal
	}

	const showLoginNotification = () => {
		setShowNotification(true)
		setTimeout(() => {
			setShowNotification(false)
		}, 3000) // Hide notification after 3 seconds
	}

	return (
		<>
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
			<Navbar />
			{children}
		</>
	)
}

export default RootWrapper
