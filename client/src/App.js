import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"
import React, {useCallback, useEffect} from "react"

import Home from "./components/Home"
import Nav from "./components/Nav"
import Character from "./components/Character"
import Login from "./components/Login"
import Settings from "./components/Settings"
import Create from "./components/Create"
import { AuthContext } from "./context/auth-context"
import EditCharacter from './components/EditCharacter';

let logoutTimer

function App() {
  const [token, setToken] = React.useState(false)
  const [userId, setUserId] = React.useState(null)
  const [tokenExpirationDate, setTokenExpirationDate] = React.useState()
  const [darkMode, setDarkMode] = React.useState(true)

  // Logs in and sets token
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token)
    setUserId(uid)
    const tokenExpirationDate =  expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpirationDate(tokenExpirationDate)
    localStorage.setItem("userData", JSON.stringify({
      userId: uid, 
      token,
      expiration: tokenExpirationDate.toISOString()
    }))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpirationDate(null)
    setUserId(null)
    localStorage.removeItem("userData")
  }, [])

  // Auto login
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"))

    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
    
  }, [login])

  // Auto logout
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  return (
    <div className={darkMode ? "App" : "App-light"}>
      <AuthContext.Provider 
        value={{ userId : userId, loggedIn : !!token, token: token, darkMode: darkMode, login: login, logout: logout, setDarkMode: setDarkMode }}>
        <Router>
        {token ? <Nav /> : null}
          {token && <Routes>
            <Route path="/edit/:id" element={<EditCharacter />} />
            <Route path="/create" element={<Create />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/character" element={<Character />} />
            <Route path="/" element={<Home />} />
          </Routes>}
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
