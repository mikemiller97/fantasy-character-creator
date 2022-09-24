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
                <img className ="elf" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b6acac55-3665-489e-a677-141a48b0ebd5/d2wbgvp-02e547e6-9017-41cd-b67c-ef4d040aadeb.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I2YWNhYzU1LTM2NjUtNDg5ZS1hNjc3LTE0MWE0OGIwZWJkNVwvZDJ3Ymd2cC0wMmU1NDdlNi05MDE3LTQxY2QtYjY3Yy1lZjRkMDQwYWFkZWIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.7fjjO0cwnRbRZBRYTTtLo9vqcG1_whuXGxBKWXYTqBM" alt="a drawing of an elf" />
            <div className={auth.darkMode ? "login-page": "login-page-light"}>
                <div className="login-text">
                    <h1 className="title">Fantasy Character Creator</h1>
                    <p>Welcome to Fantasy Character Creator! This website will help you create a fantasy character</p>
                    <p>Save your characters in our database and edit them as needed later.</p>
                    <p className="login-bottom-text">The website is completely free. Let your imagination drive you!</p>
                </div>
                <div className="login-buttons">
                    {/* Tertiary operator prevents the button from working when a different form is up */}
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={showSignUp ? () => {return} : () => setShowLogin(true)}>Log in</button>
                    <p>――― or ―――</p>
                    {/* Tertiary operator prevents the button from working when a different form is up */}
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={showLogin ? () => {return} : () => setShowSignUp(true)}>Sign Up</button>
                </div>

                {showLogin ? <LoginForm setShowLogin = {setShowLogin} /> : null}
                {showSignUp ? <SignUpForm setShowSignUp = {setShowSignUp} /> : null}
            </div>
        </div>
    )
}