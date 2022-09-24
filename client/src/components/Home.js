import React, { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/auth-context"
import { CirclesWithBar } from 'react-loader-spinner'

import Character from "./Character"
import "../styles/home.css"

export default function Home() {
    let navigate = useNavigate() 
    const auth = useContext(AuthContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const [serverError, setServerError] = React.useState(0)
    const [characterList, setCharacterList] = React.useState([])
    const [showWarning, setShowWarning] = React.useState(false)
    const [selectedDelete, setSelectedDelete] = React.useState("")
    const [characterListChange, setCharacterListChange] = React.useState(0)

    const deleteCharacter = async (e) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/characters/${selectedDelete}`, {
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
        setIsLoading(false)
        setCharacterList(characterList.filter(character => character.id !== selectedDelete))
        setCharacterListChange(prev => prev++)
        setShowWarning(false)
    }

    const loadCharacters = async (e) => {
        setIsLoading(true)

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
                
            setCharacterList(responseData.characters)
        } catch (err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }

            setServerError(err.message || "Something went wrong please try again")
        }
        setShowWarning(false)
        setIsLoading(false)
        setCharacterListChange(prev => prev++)
    }

    const cancelDelete = () => {
        setSelectedDelete("")
        setShowWarning(false)
    }
    
    useEffect(() => {
        if (!auth.loggedIn) {
            navigate("/login")
        }

       loadCharacters()
    }, [auth.loggedIn, characterListChange])

    return (
        <div className={auth.darkMode ? "home-page" : "home-page-light"}>
            <h1 style={ !auth.darkMode ? {color: "black"} : {color: "white"}}>Characters</h1>
            {isLoading ? <CirclesWithBar
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
            <div className="characters">
            {characterList ? characterList.map(character => {
                return ( 
                <Character 
                    name={character.name}
                    picture={character.picture}
                    race={character.race}
                    sex={character.sex}
                    profession={character.profession}
                    playerClass={character.playerClass}
                    bio={character.bio}
                    alignmentLaw={character.alignmentLaw}
                    alignmentMoral={character.alignmentMoral}
                    age={character.age}
                    key={character.id}
                    id={character.id}
                    characterList={characterList}
                    setShowWarning={setShowWarning}
                    setSelectedDelete={setSelectedDelete}
                /> )
            }) : null}
            </div>
            {showWarning ? 
            <div className={auth.darkMode ? "deletion-warning": "deletion-warning-light"}>
                <p>Are you sure you want to delete this character? This cannot be undone.</p>
                <div className="deletion-warning-buttons">
                    <button className={auth.darkMode ? "button-6": "button-18"} onClick={deleteCharacter}>Yes</button>
                    <button className={auth.darkMode ? "button-6": "button-18"}  onClick={cancelDelete}>No</button>
                </div>
            </div> : null}
            <Link to="/create" style={{ textDecoration: 'none' }}><button className={auth.darkMode ? "button-6" : "button-18"}>Create Character</button></Link>
        </div>
    )
}