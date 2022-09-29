import React, {useEffect} from "react"
import { CirclesWithBar } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom"
import Axios from "axios"

import { AuthContext } from "../context/auth-context"

import "../styles/create.css"

export default function Create() {
    const hiddenFileInput = React.useRef(null)
    const auth = React.useContext(AuthContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const [serverError, setServerError] = React.useState(0)
    const [formData, setFormData] = React.useState(
        {
            name: "",
            picture: "https://i.imgur.com/PknKFnO.jpg",
            age: "",
            race: "",
            sex: "",
            profession: "",
            playerClass: "",
            alignmentLaw: "",
            alignmentMoral: "",
            bio: "",
            publicId: ""
        }
    )
    const [imageSelected, setImageSelected] = React.useState(false)
    const [previewUrl, setPreviewUrl] = React.useState(false)
    let navigate = useNavigate(); 

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
    
    // Handles new character creation
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        let pictureToUse = ""
        let publicId = ""

        if (imageSelected) {
            const formDataUp = new FormData()
            formDataUp.append("file", imageSelected)
            formDataUp.append("upload_preset", "qluhqdc0")

            try {
                const response = await Axios.post("https://api.cloudinary.com/v1_1/dcuxfftot/image/upload", formDataUp)
                console.log(response)

                pictureToUse = response.data.secure_url
                publicId = response.data.public_id
            } catch(err) {
                if (err.message.includes("is not valid JSON")) {
                    err.message = "Error: could not connect to server"
                }
    
                setServerError(err.message || "Something went wrong please try again")
                console.log(err)
                }
            }
            
        try {
            const response = await fetch("/api/characters/", {
                method: "POST",
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
                    publicId: publicId
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
    
    const handleFileUpload = (event) => {
        hiddenFileInput.current.click();
    }
    

    useEffect(() => {
        if (!auth.loggedIn) {
            navigate("/login")
        }
        if (!imageSelected) return
        
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(imageSelected)
    }, [auth.loggedIn, imageSelected, navigate])
    
    return (
        <div className="character-creation">
            <h1 style={auth.darkMode ? {color: "white"} : {color: "black"}}>Character Creation</h1>
            <form className={auth.darkMode ? "creation-form" : "creation-form-light" } onSubmit={handleSubmit} autocomplete="off">
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
                    className="file-select"
                    ref={hiddenFileInput}
                    style={{display: "none"}}
                />
                <button className="button-4" type="button" onClick={handleFileUpload}>Upload a file</button> 
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
                <select className="alignment-select" name="alignmentLaw" id="alignmentLaw" value={formData.alignmentLaw} onChange={handleChange}>
                    <option value="">--</option>
                    <option value="Lawful">Lawful</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Chaotic">Chaotic</option>
                </select>
                <select className="alignment-select" name="alignmentMoral" id="alignmentMoral" value={formData.alignmentMoral} onChange={handleChange}>
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
                    value={formData.value}
                    placeholder="Once upon a time..."
                />
                <button className={auth.darkMode ? "button-4": "button-18"}>Submit</button>
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
        </div>
    )
}