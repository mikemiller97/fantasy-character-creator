import React from "react"

import "../styles/nav.css"

export default function Nav() {
    return (
        <nav className="navbar">
            <ul className="options">
                <li>Home</li>
                <li>Characters</li>
                <li>Create Character</li>
                <li>Sign Out</li>
                <li>Settings</li>
            </ul>
        </nav>
    )
}