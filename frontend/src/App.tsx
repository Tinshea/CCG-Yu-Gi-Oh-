

import { useEffect, useMemo, useRef, useState, useContext} from 'react'
import { CollectionContext } from './context/CollectionContext'
import './index.css'
import { BrowserRouter,Route, Routes } from 'react-router-dom'
import {Home} from './components/Home'
import { Collection } from './components/Collection'
import { Profile } from './components/Profile'
import { Market } from './components/Market'

export const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Collection" element={<Collection />} />
        <Route path="/Market" element={<Market />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Boosters" element={<Home />} />

      </Routes>
  )
}
