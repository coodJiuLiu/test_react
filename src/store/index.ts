import app from './app';
import {configureStore}  from  '@reduxjs/toolkit'
export default configureStore({
  reducer:{
    app
  }
})