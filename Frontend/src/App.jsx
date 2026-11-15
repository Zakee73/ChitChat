import { useState } from 'react'

import SignUp from './SignUp'

import LogIn from './LogIn'
import { BrowserRouter , Routes , Route} from 'react-router-dom'
import './App.css'
import Home from './Home'


function App() {

  return (
    <>
   
    <BrowserRouter>
    <Routes>
  <Route path='/' element = {<Home/>}/>
  <Route path='/signup' element = {<SignUp/>}/>
  <Route path='/login' element = {<LogIn/>}/>
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
