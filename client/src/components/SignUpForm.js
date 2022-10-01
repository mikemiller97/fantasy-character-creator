import React, { useEffect, useContext } from "react"
import { CirclesWithBar } from 'react-loader-spinner'
import { AuthContext } from "../context/auth-context"

import "../styles/signupForm.css"

export default function SignUpForm(props) {
    
    const [submitted, setSubmitted] = React.useState(0)
    const [serverError, setServerError] = React.useState(0)
    const [accountCreated, setAccountCreated] = React.useState(false)
    const [formData, setFormData] = React.useState(
        {
            email: "",
            password: "",
            confirmPassword: ""
        }
    )
    const [isLoading, setIsLoading] = React.useState(false)
    const auth = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitted((prev) => prev++)

        try {
            setIsLoading(true)
            const response = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })

            const responseData = await response.json()
            
            // Displays error to front end
            if (!response.ok) {
                throw new Error(responseData.message)
            }

            setAccountCreated(true)
            auth.login(responseData.userId, responseData.token)
        } catch(err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }

            setServerError(err.message || "Something went wrong please try again")
        }
        setIsLoading(false)
    }

    //Updates desired user information
    const handleChange = (event) => {
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    useEffect(() => {
        
    }, [submitted])
    
    return (
        <div className={auth.darkMode ? "signup-form-page" : "signup-form-page-light"}>
            <form className={auth.darkMode ? "signup-form" : "signup-form-light"} onSubmit={handleSubmit}>
                <div className="signup-info">
                    <label htmlFor="emailSignUp">Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="passwordSignUp">Password (must be at least 6 characters long)</label>
                    <input 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="confirmSignUp">Confirm password</label>
                    <input 
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="signup-form-buttons">
                    <button className={auth.darkMode ? "button-6": "button-18"}>Create Account</button>
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={() => props.setShowSignUp(false)} type="button">Close</button>
                </div>
            </form>
            {isLoading ? 
            <CirclesWithBar
                height="50"
                width="50"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                outerCircleColor=""
                innerCircleColor=""
                barColor=""
                ariaLabel='circles-with-bar-loading'
            /> : null}
            {serverError ? <p>{(serverError)}</p> : null}
            {accountCreated ? <p>Account created!</p> : null}
        </div>
    )
}