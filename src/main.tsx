import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './router' // 引入路由
import './index.scss'
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Router /> 
  // </React.StrictMode>,
)