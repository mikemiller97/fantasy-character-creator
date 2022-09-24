import React, {useContext, useEffect, useCallback} from "react"
import { CirclesWithBar } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../context/auth-context"

import "../styles/changePassword.css"

export default function ChangePassword(props) {
    const auth = useContext(AuthContext)
    let navigate = useNavigate() 
    
    const [isLoading, setIsLoading] = React.useState(false)
    const [submitted, setSubmitted] = React.useState(0)
    const [serverError, setServerError] = React.useState(0)
    const [passwordChanged, setPasswordChanged] = React.useState(false)
    const [formData, setFormData] = React.useState(
        {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
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
            const response = await fetch("/api/users/changepassword", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                },
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                    confirmNewPassword: formData.confirmNewPassword,
                    userId: auth.userId
                })
            })

            const responseData = await response.json()
            
            // Displays error to front end
            if (!response.ok) {
                throw new Error(responseData.message)
            }

            setPasswordChanged(true)
        } catch(err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }

            setServerError(err.message || "Something went wrong please try again")
        }
        setIsLoading(false)
    }, [auth.token, auth.userId, formData.newPassword, formData.oldPassword])

    // Sends http request
    useEffect(() => {   
        if (!auth.loggedIn) {
            navigate("/login")
        }

        handleSubmit()

    }, [submitted, auth.loggedIn, navigate, handleSubmit])

    // Logs out user when password is changed
    useEffect(() => {
        if (passwordChanged) {
            setTimeout(() => {
                auth.logout()
            }, 5000)
        }
    })

    return (
        <div className={auth.darkMode ? "change-password-page" : "change-password-page-light"}>
            <form className={auth.darkMode ? "change-password-form" : "change-password-form-light"} onSubmit={handleSubmit}>
                <label htmlFor="oldPassword" >Old password</label>
                <input 
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="newPassword">New password (must be at least 6 characters long)</label>
                <input 
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="confirmNewPassword">Confirm new password</label>
                <input 
                    type="password"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    required
                />
                <div className="change-password-buttons">
                    <button className={auth.darkMode ? "button-6": "button-18"}>Change Password</button>
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={() => props.setShowChangePassword(false)} type="button">Close</button>
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
            {serverError && !passwordChanged ? <p>{(serverError)}</p> : null}
            {passwordChanged ? 
                <div className={auth.darkMode ? "password-changed-notice" : "password-changed-notice-light"}>
                    <p>Your password has been changed. </p> 
                    <br></br>
                    <p>You will now be logged out.</p>
                </div>
            : null}
        </div>
    )
}