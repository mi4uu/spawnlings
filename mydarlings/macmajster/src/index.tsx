import React from 'react'
import ReactDOM from 'react-dom/client'
import { reportWebVitals } from './reportWebVitals'

const App = () => {
  return (
    <div>
      HELLO 😖 u
    </div>
  )
}

const root = ReactDOM.createRoot( document.getElementById( 'root' ) )
root.render(
  (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ),
)
/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)*/
reportWebVitals()
