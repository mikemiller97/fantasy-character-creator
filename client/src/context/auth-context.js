import { createContext } from "react";

export const AuthContext = createContext({
    loggedIn: false,
    token: null,
    userId: null,
    darkMode: true,
    login: () => {},
    logout: () => {},
    setDarkMode: () => {}
})