import React, { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../context/auth-context"
import "../styles/character.css"

export default function Character(props) {
    let navigate = useNavigate() 
    const auth = useContext(AuthContext)
    
    const editCharacter = () => {
        navigate(`/edit/${props.id}`)
    }

    const deleteCharacter = () => {
        props.setShowWarning(true)
        props.setSelectedDelete(props.id)
    }

    const [shortBio, setShortBio] = React.useState("")
    const [bioShow, setBioShow] = React.useState("(See more)")

    const changeBioLength = () => {
        if (bioShow === "(See more)") {
            setShortBio(props.bio)
            setBioShow("(See less)")
            return
        }

        setShortBio(props.bio.slice(0, 140) + "...")
        setBioShow("(See more)")
    }

    useEffect(() => {
        // Adjusts appearance if bio is short
        if (props.bio.length > 140) {
            setShortBio(props.bio.slice(0, 140)+ "...")
        }
    }, [props.bio])
    
    return (
        <div className={auth.darkMode ? "character" : "character-light"}>
            {props.picture ? <img src={props.picture} alt="Your character"/>: <div></div> }
            <p className="character-name">{props.name}</p>
            <p>Age: {props.age}</p>
            <p>Race: {props.race}</p>
            <p>Sex: {props.sex}</p>
            <p>Profession: {props.profession}</p>
            <p>Class: {props.playerClass}</p>
            <p>Alignment: {props.alignmentLaw} {props.alignmentMoral}</p>
            {props.bio.length > 140 ? 
                <div className="bio">
                    <p>{shortBio}</p>
                    <p className="change-length"onClick={changeBioLength}>{bioShow}</p> 
                </div>
                : <p>{props.bio}</p>}
            <div className="character-buttons">
                <button className={auth.darkMode? "button-4" : "button-18"} onClick={editCharacter}>Edit</button>
                <button className={auth.darkMode? "button-4" : "button-18"} onClick={deleteCharacter}>Delete</button>
            </div>
        </div>
    )
}