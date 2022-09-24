import React, {useContext, useEffect, useCallback} from "react"
import { CirclesWithBar } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../context/auth-context"

import "../styles/deleteAccount.css"

export default function DeleteAccount(props) {
    const auth = useContext(AuthContext)
    let navigate = useNavigate() 
    
    const [isLoading, setIsLoading] = React.useState(false)
    const [submitted, setSubmitted] = React.useState(0)
    const [serverError, setServerError] = React.useState(0)
    const [accountDeleted, setAccountDeleted] = React.useState(false)

     // Function to delete character
     const deleteCharacter = useCallback(async (cid) => {
        try {
            const response = await fetch(`/api/characters/withaccount/${cid}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                }
            })
            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.message)
            }
        } catch(err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }

            setServerError(err.message || "Something went wrong please try again")
        }
    }, [auth.token])

    // Fuction to load list of characters
    const loadCharacters = useCallback(async (e) => {
        try {
            const response = await fetch(`/api/characters/userid/${auth.userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                }
            })
            const responseData = await response.json()
                
            // Displays error to front end
            if (!response.ok) {
                throw new Error(responseData.message)
            }

            //Deletes characters
            responseData.characters.forEach((character) => {
                deleteCharacter(character.id)
            })

        } catch (err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }

            setServerError(err.message || "Something went wrong please try again")
        }
    }, [auth.token, auth.userId, deleteCharacter])


    // Handles server request
    const handleSubmit = useCallback(async () => {
        setIsLoading(true)
        setSubmitted((prev) => prev++)
        // Gets list of characters and deletes them
        loadCharacters()
    
        //Deletes account
        try {
            const response = await fetch(`/api/users/${auth.userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                }
            })

            const responseData = await response.json()
            
            // Displays error to front end
            if (!response.ok) {
                throw new Error(responseData.message)
            }

            setAccountDeleted(true)
        } catch(err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }

            setServerError(err.message || "Something went wrong please try again")
        }
        setIsLoading(false)
    }, [auth.token, auth.userId, loadCharacters])

    // Sends http request
    useEffect(() => {   
        if (!auth.loggedIn) {
            navigate("/login")
        }
        if (submitted < 1) {
            return
        }
        handleSubmit()

    }, [auth.loggedIn, navigate, handleSubmit, submitted])

    // Logs out user when account is deleted
    useEffect(() => {
        if (accountDeleted) {
            setTimeout(() => {
                auth.logout()
            }, 5000)
        }
    })

    return (
        <div className={auth.darkMode ? "delete-account-page" : "delete-account-page-light"}>
            <p style={{color: "red"}}>Are you sure you want to delete your account? This cannot be undone and you will lose all your characters.</p>
            <br></br>
            <div className="delete-account-buttons">
                <button className={auth.darkMode ? "button-6": "button-18"} onClick={handleSubmit}>Delete Account</button>
                <button className={auth.darkMode ? "button-6": "button-18"} onClick={() => props.setShowDeleteAccount(false)} type="button">Close</button>
            </div>

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
            {serverError && ! accountDeleted ? <p>{(serverError)}</p> : null}
            {accountDeleted ? 
                <div className={auth.darkMode ? "account-deleted-notice" : "account-deleted-notice-light"}>
                    <p>Your account has been deleted.</p>
                </div>
            : null}
        </div>
    )
}