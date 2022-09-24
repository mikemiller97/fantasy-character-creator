import React, { useContext } from "react"
import { CirclesWithBar } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/auth-context"

import "../styles/loginForm.css"

export default function LoginForm(props) {
    const [formData, setFormData] = React.useState(
        {
            email: "",
            password: ""
        }
    )
    const [isLoading, setIsLoading] = React.useState(false)
    const [serverError, setServerError] = React.useState(0)
    const auth = useContext(AuthContext)
    const [request, setRequest] = React.useState(0)
    let navigate = useNavigate(); 

    const checkLogIn = async (e) => {
        e.preventDefault()
        
        try {
            setIsLoading(true)
            const response = await fetch("/api/users/login", {
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

            setServerError(false)

            auth.login(responseData.userId, responseData.token)
            navigate('/')
        } catch(err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }
            setServerError(err.message || "Something went wrong please try again")
        }
        setIsLoading(false)

        setRequest(request + 1)
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

    return (
        <div className={auth.darkMode ? "login-form-page" : "login-form-page-light"}>
            <form className={auth.darkMode ? "login-form" : "login-form-light"} onSubmit={checkLogIn}>
                <div className="login-info">
                    <label htmlFor="emailLogIn">E-mail</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                    <label htmlFor="passwordLogIn">Password</label>
                    <input 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="login-form-buttons">
                    <button className={auth.darkMode ? "button-6": "button-18"}>Enter</button>
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={() => props.setShowLogin(false)} type="button">Close</button>
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
            {serverError ? <p>{serverError}</p> : null}
        </div>
    )
}