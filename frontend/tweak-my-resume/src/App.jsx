import { useState } from 'react'
import Nav from "./components/Nav/Nav.jsx"
import Home from "./components/Home/Home.jsx"
import './App.css'

function App({apiUrl}) {
  const [count, setCount] = useState(0)
  
  return (
    <>
    <Nav />
    <Home />
    </>
  )
}

export default App
