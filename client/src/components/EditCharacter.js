import React, { useEffect, useContext, useCallback } from "react"
import { CirclesWithBar } from 'react-loader-spinner'
import { useNavigate, useLocation } from "react-router-dom"
import Axios from "axios"

import { AuthContext } from "../context/auth-context"
import "../styles/editCharacter.css"

export default function EditCharacter(props) {
    const hiddenFileInput = React.useRef(null)
    const auth = useContext(AuthContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const [serverError, setServerError] = React.useState(0)
    const [character, setCharacter] = React.useState({})
    const [submitted, setSubmitted] = React.useState(0)
    const [formData, setFormData] = React.useState(
        {

        }
    )
    const [imageSelected, setImageSelected] = React.useState(false)
    const [previewUrl, setPreviewUrl] = React.useState(false)
    let navigate = useNavigate()
    const location = useLocation();
    const characterId = location.pathname.replace("/edit/", "")
    
    // Loads character data
    const loadData = useCallback(async () => {
        setSubmitted(prev => prev++)
        setIsLoading(true)
        try {
            const response = await fetch(`/api/characters/${characterId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                }
            })

            const responseData = await response.json()
            if (!response.ok) {
                throw new Error(responseData.message)
            }
            setCharacter(responseData.character)
            console.log(responseData.character)
            setFormData({
                name: responseData.character.name,
                picture: responseData.character.picture,
                age: responseData.character.age,
                race: responseData.character.race,
                sex: responseData.character.sex,
                profession: responseData.character.profession,
                playerClass: responseData.character.playerClass,
                alignmentLaw: responseData.character.alignmentLaw,
                alignmentMoral: responseData.character.alignmentMoral,
                bio: responseData.character.bio,
                publicId: responseData.character.publicId
            })
        } catch (err) {
            if (err.message.includes("is not valid JSON")) {
                err.message = "Error: could not connect to server"
            }

            setServerError(err.message || "Something went wrong please try again")
        }
        setIsLoading(false)
    }, [auth.token, characterId])

    const handleChange = (event) => {
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    // Handles change in picture
    const handleUpload = async (files) => {
        setImageSelected(files[0])
    }

    // Handles edit request
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        console.log(formData)

        let pictureToUse
        formData.picture === "https://i.imgur.com/PknKFnO.jpg" ? pictureToUse = "" : pictureToUse = formData.picture
        let publicId = formData.publicId
        let pictureChanged = false
        let oldPublicId = formData.publicId

        if (imageSelected) {
            const formDataUp = new FormData()
            formDataUp.append("file", imageSelected)
            formDataUp.append("upload_preset", "qluhqdc0")

            try {
                const response = await Axios.post("https://api.cloudinary.com/v1_1/dcuxfftot/image/upload", formDataUp)
                pictureToUse = response.data.secure_url
                publicId = response.data.public_id
                pictureChanged = true
            } catch(err) {
                if (err.message.includes("is not valid JSON")) {
                    err.message = "Error: could not connect to server"
                }
    
                setServerError(err.message || "Something went wrong please try again")
                console.log(err)
                }
            }
            
        
        try {
            const response = await fetch(`/api/characters/${characterId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token
                },
                body: JSON.stringify({
                    name: formData.name,
                    picture: pictureToUse,
                    age: formData.age,
                    race: formData.race,
                    sex: formData.sex,
                    profession: formData.profession,
                    playerClass: formData.playerClass,
                    alignmentLaw: formData.alignmentLaw,
                    alignmentMoral: formData.alignmentMoral,
                    bio: formData.bio,
                    creator: auth.userId,
                    pictureChanged,
                    publicId,
                    oldPublicId: oldPublicId
                })
            })
                const responseData = await response.json()
                
                // Displays error to front end
                if (!response.ok) {
                    throw new Error(responseData.message)
                }
                navigate("/")
            } catch(err) {
                if (err.message.includes("is not valid JSON")) {
                    err.message = "Error: could not connect to server"
                }
    
                setServerError(err.message || "Something went wrong please try again")
            }
            setIsLoading(false)
    }
    
    const handleFileUplad = (event) => {
        hiddenFileInput.current.click();
    }

    useEffect(() => {
        if (!auth.loggedIn) {
            navigate("/login")
        }
        
        loadData()

        if (!imageSelected) return
        
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(imageSelected)

    }, [submitted, imageSelected, auth.loggedIn, loadData, navigate])

    // Sets picture to a default blank one if one was never uploaded
    useEffect(() => {
        if (formData.picture === "") {
            setFormData(prevFormData => {
                return {
                    ...prevFormData,
                    picture: "https://i.imgur.com/PknKFnO.jpg"
                }
            })
        }
    }, [formData.picture])

    return (
        <div className="edit-character">
            <h1 style={auth.darkMode ? {color: "white"} : {color: "black"}}>Edit</h1>
            {character ? 
                <form className={auth.darkMode ? "creation-form" : "creation-form-light"} onSubmit={handleSubmit} autoComplete="off">
                    <label htmlFor="name">Name </label>
                    <input 
                        type="text"
                        onChange={handleChange}
                        name="name"
                        id="name"
                        value={formData.name}
                        placeholder="Evan"
                        required
                    />

                    {imageSelected ? <img src={previewUrl} width="100" height="100" alt="character" /> : <img src={formData.picture} width="100" height="100" alt="character" />}
                    <input 
                        type="file"
                        name="picture"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(event) => handleUpload(event.target.files)}
                        style={{display: "none"}}
                        ref={hiddenFileInput}
                    /> 
                    <button className="button-4" type="button" onClick={handleFileUplad}>Upload a file</button> 
                    <label htmlFor="age">Age (in years)</label>
                    <input 
                        type="number"
                        onChange={handleChange}
                        name="age"
                        id="age"
                        value={formData.age}
                        placeholder="20"
                    />
                    <label htmlFor="race">Race </label>
                    <input 
                        type="text"
                        onChange={handleChange}
                        name="race"
                        id="race"
                        value={formData.race}
                        placeholder="Elf"
                    />
                    <label htmlFor="sex">Sex </label>
                    <input 
                        type="text"
                        onChange={handleChange}
                        name="sex"
                        id="sex"
                        value={formData.sex}
                        placeholder="Male"
                    />
                    <label htmlFor="profession">Profession </label>
                    <input 
                        type="text"
                        onChange={handleChange}
                        name="profession"
                        id="profession"
                        value={formData.profession}
                        placeholder="Barber"
                    />
                    <label htmlFor="playerClass">Class </label>
                    <input 
                        type="text"
                        onChange={handleChange}
                        name="playerClass"
                        id="playerClass"
                        value={formData.playerClass}
                        placeholder="Priest"
                    />
                    <label>Alignment </label>
                    <select className="alignment-select" value={formData.alignmentLaw} name="alignmentLaw" id="alignmentLaw" onChange={handleChange}>
                        <option value="">--</option>
                        <option value="Lawful">Lawful</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Chaotic">Chaotic</option>
                    </select>
                    <select className="alignment-select" value={formData.alignmentMoral} name="alignmentMoral" id="alignmentMoral" onChange={handleChange}>
                        <option value="">--</option>
                        <option value="Good">Good</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Evil">Evil</option>
                    </select>
                    <label htmlFor="bio">Bio </label>
                    <textarea
                        onChange={handleChange}
                        name="bio"
                        id="bio"
                        value={formData.bio}
                        placeholder="Once upon a time..."
                    />
                    <button className={auth.darkMode ? "button-4": "button-18"}>Submit</button>
                </form>
            : null}

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
        </div>
    )
}