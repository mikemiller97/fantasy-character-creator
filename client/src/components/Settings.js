import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../context/auth-context"
import ChangePassword from "./ChangePassword"
import ChangeEmail from "./ChangeEmail"
import DeleteAccount from "./DeleteAccount"

import "../styles/settings.css"

export default function Settings() {
    let navigate = useNavigate(); 
    const auth = useContext(AuthContext)
    const [showChangeEmail, setShowChangeEmail] = React.useState(false)
    const [showChangePassword, setShowChangePassword] = React.useState(false)
    const [showDeleteAccount, setShowDeleteAccount] = React.useState(false)

    useEffect(() => {
        if (!auth.loggedIn) {
            navigate("/login")
        }
    })
    
    return (
        <div className={auth.darkMode ? "settings" : "settings-light"}>
            <h1 style={auth.darkMode ? {color: "white"} : {color: "black"}}>Settings</h1>
            {auth.darkMode ? <button className="button-6" onClick={() => auth.setDarkMode(false)}>Light Mode</button> : <button className="button-18" onClick={() => {auth.setDarkMode(true)}}>Dark Mode</button>}
            <button className={auth.darkMode? "button-6" : "button-18"} onClick={showChangePassword || showDeleteAccount ? () => { return } : () => setShowChangeEmail(true)}>Change E-mail</button>
            <button className={auth.darkMode? "button-6" : "button-18"} onClick={showChangeEmail || showDeleteAccount ? () => { return } : () => setShowChangePassword(true)}>Change Password</button>
            <button className={auth.darkMode? "button-6" : "button-18"} onClick={showChangeEmail || showChangePassword ? () => { return } : () => setShowDeleteAccount(true)}>Delete Account</button>
            {showChangePassword ? <ChangePassword setShowChangePassword = { setShowChangePassword }/> : null }
            {showChangeEmail ? <ChangeEmail setShowChangeEmail = { setShowChangeEmail }/> : null }
            {showDeleteAccount ? <DeleteAccount setShowDeleteAccount = { setShowDeleteAccount } /> : null}
        </div>
    )
}