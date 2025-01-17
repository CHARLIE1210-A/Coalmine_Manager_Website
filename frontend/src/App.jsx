import Login from "./components/LoginN"
import Register from "./components/Register"
import User_register from "./components/User_register"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Adjustment from './components/Adjustment'
import Home from './components/Home'
import RequestScheduleStatus from "../src/components/Request_schedule"
import InwardForm from './components/inward_entry'
import OutwardEntryForm from './components/outward_entry'
import React from 'react'
import Landing from "./components/Landing"
import Dashboard from "./components/Dashboard"
import { MineIdProvider } from './api/context'
import RailwayForm from "./components/railway_Rs"
function App() {


  return (
    <BrowserRouter>
      <MineIdProvider>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/User_register" element={<User_register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Adjustment" element={<Adjustment />} />
          <Route path='/Requestschedule' element={<RequestScheduleStatus />} />
          <Route path='/Inwardentry' element={<InwardForm />} />
          <Route path='/Outwardentry' element={<OutwardEntryForm />} />
          <Route path="/Requestform" element={<RailwayForm/>}/>
          <Route path="/Dashboard" element={<Dashboard/>}/>
        </Routes>
      </MineIdProvider>

    </BrowserRouter>
  )
}

export default App