import React, { useContext, useEffect } from "react"
import { AuthContext } from "../context/auth-context"
import { useNavigate } from "react-router-dom"

import LoginForm from "./LoginForm"
import SignUpForm from "./SignUpForm"
import "../styles/login.css"

export default function Login() {
    const [showLogin, setShowLogin] = React.useState(false)
    const [showSignUp, setShowSignUp] = React.useState(false)
    let navigate = useNavigate(); 
    const auth = useContext(AuthContext)
    
    useEffect(() => {
        if (auth.loggedIn) {
            navigate("/")
        }
    })

    return (
        <div className="page-and-image">
                <img className ="elf" src="https://i.imgur.com/Ep3S3lV.jpg" alt="a drawing of an elf" />
            <div className={auth.darkMode ? "login-page": "login-page-light"}>
                <div className="login-text">
                    <h1 className="title" style={auth.darkMode ? {color: "white"} : {color: "black"}}>Fantasy Character Creator</h1>
                    <p>Welcome to Fantasy Character Creator! This website will help you create a fantasy character</p>
                    <p>Save your characters in our database and edit them as needed later.</p>
                    <p className="login-bottom-text">The website is completely free. Let your imagination drive you!</p>
                </div>
                <div className="login-buttons">
                    {/* Tertiary operator prevents the button from working when a different form is up */}
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={showSignUp ? () => {return} : () => setShowLogin(true)}>Log in</button>
                    <p>or</p>
                    {/* Tertiary operator prevents the button from working when a different form is up */}
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={showLogin ? () => {return} : () => setShowSignUp(true)}>Sign Up</button>
                </div>

                {showLogin ? <LoginForm setShowLogin = {setShowLogin} /> : null}
                {showSignUp ? <SignUpForm setShowSignUp = {setShowSignUp} /> : null}
            </div>
        </div>
    )
}