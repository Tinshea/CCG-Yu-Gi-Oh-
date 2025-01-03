import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import "./index.css";
import { CollectionProvider } from './context/CollectionContext'


const node = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(node)

root.render(
<CollectionProvider>
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
</CollectionProvider>
)
