import React, { useContext } from "react"
import { Link } from "react-router-dom"

import { AuthContext } from "../context/auth-context"
import "../styles/nav.css"

export default function Nav() {
    const auth = useContext(AuthContext)
    
    const handleLogout = () => {
        auth.logout()
    }   
    
    return (
        <nav className={"navbar"}>
            <ul className={auth.darkMode ? "options" : "options-light"}>
                <Link to="/" style={{ textDecoration: 'none' }}><li>Character List</li></Link>
                <Link to="/create" style={{ textDecoration: 'none' }}><li>Create Character</li></Link>
                <Link to="/settings" style={{ textDecoration: 'none' }}><li>Adjust Settings</li></Link>
                <li onClick={handleLogout}>Log out</li>
            </ul>
        </nav>
    )
}