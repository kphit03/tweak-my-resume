import { useState } from 'react'
import Nav from "./components/Nav.jsx"
import Home from "./components/Home.jsx"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Nav />
    <Home />
    </>
  )
}

export default App
