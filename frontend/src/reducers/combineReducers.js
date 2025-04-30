import React from 'react'
import { combineReducers } from '@reduxjs/toolkit'
import authReducers from "../slices/authSlice"
import profileReducers from "../slices/profileSlice"
import cartReducers from "../slices/cartSlice"
import courseReducer from "../slices/courseSlice"
import videoReducers from "../slices/viewCourseSlice"
const rootReducer = combineReducers({
    auth:authReducers,
    profile: profileReducers,
    cart : cartReducers,
    course : courseReducer,
    viewCourse:videoReducers

});

export default rootReducer