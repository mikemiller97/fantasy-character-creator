import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom"
import React from "react"

import Home from "./components/Home"
import Nav from "./components/Nav"
import Character from "./components/Character"
import Login from "./components/Login"

function App() {
  const [loggedIn, setLoggedIn] = React.useState(true)

  return (
    <div className="App">
      {loggedIn ? <Nav /> : null}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/character" element={<Character />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
