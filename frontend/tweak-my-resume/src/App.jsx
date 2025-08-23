import { useState } from 'react'
import Nav from "./components/Nav.jsx"
import Home from "./components/Home.jsx"
import './App.css'

function App({apiUrl}) {
  const [count, setCount] = useState(0)
  
  return (
    <>
    <Nav />
    <Home />
    <div>{apiUrl}</div>
    </>
  )
}

export default App
