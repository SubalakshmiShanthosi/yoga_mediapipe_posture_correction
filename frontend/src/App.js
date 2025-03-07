import React from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Home from './pages/home/Home'
import YogaPosture from './pages/yoga/YogaPosture'
import YogaBreathing from './pages/yoga/YogaBreathing'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/startPosture' element={<YogaPosture/>}/>
        <Route path='/startBreathing' element={<YogaBreathing/>}/>
      </Routes>
    </Router>
  )
}


