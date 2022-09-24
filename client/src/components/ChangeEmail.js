import React, {useContext, useEffect, useCallback} from "react"
import { CirclesWithBar } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../context/auth-context"

import "../styles/changeEmail.css"

export default function ChangeEmail(props) {
    const auth = useContext(AuthContext)
    let navigate = useNavigate() 
    
    const [isLoading, setIsLoading] = React.useState(false)
    const [submitted, setSubmitted] = React.useState(0)
    const [serverError, setServerError] = React.useState(0)
    const [emailChanged, setEmailChanged] = React.useState(false)
    const [formData, setFormData] = React.useState(
        {
            newEmail: "",
            password: ""
        }
    )

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

    // Handles server request
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        setSubmitted((prev) => prev++)

        try {
            setIsLoading(true)
            const response = await fetch("/api/users/changeemail", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                },
                body: JSON.stringify({
                    newEmail: formData.newEmail,
                    password: formData.password,
                    userId: auth.userId
                })
            })

            const responseData = await response.json()
            
            // Displays error to front end
            if (!response.ok) {
                throw new Error(responseData.message)
            }

            setEmailChanged(true)
        } catch(err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }

            setServerError(err.message || "Something went wrong please try again")
        }
        setIsLoading(false)
    }, [auth.token, auth.userId, formData.newEmail, formData.password])

    // Sends http request
    useEffect(() => {   
        if (!auth.loggedIn) {
            navigate("/login")
        }

        handleSubmit()

    }, [submitted, auth.loggedIn, navigate, handleSubmit])

    // Logs out user when email is changed
    useEffect(() => {
        if (emailChanged) {
            setTimeout(() => {
                auth.logout()
            }, 5000)
        }
    })

    return (
        <div className={auth.darkMode ? "change-email-page": "change-email-page-light"}>
            <form className={auth.darkMode ? "change-email-form": "change-email-form-light"} onSubmit={handleSubmit}>
                <label htmlFor="newEmail" >New e-mail address</label>
                <input 
                    type="email"
                    name="newEmail"
                    value={formData.newEmail}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Password</label>
                <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <div className="change-email-buttons">
                    <button className={auth.darkMode ? "button-6": "button-18"}>Change E-mail</button>
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={() => props.setShowChangeEmail(false)} type="button">Close</button>
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
            {serverError && !emailChanged ? <p>{(serverError)}</p> : null}
            {emailChanged ? 
                <div className={auth.darkMode ? "email-changed-notice" : "email-changed-notice-light"}>
                    <p>Your e-mail address has been changed. </p> 
                    <br></br>
                    <p>You will now be logged out.</p>
                </div>
            : null}
        </div>
    )
}