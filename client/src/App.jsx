import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import Room from './Pages/Room'
import './Styles/App.scss'
const App = () => {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/room/:roomId" element={<Room/>}></Route>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App