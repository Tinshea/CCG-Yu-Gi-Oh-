import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { CollectionProvider } from './context/CollectionContext'

const node = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(node)
root.render(
  <CollectionProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </CollectionProvider>
)
