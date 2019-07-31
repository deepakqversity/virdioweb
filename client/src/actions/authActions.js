import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import $ from 'jquery';
//import AgoraRTC from "agora-rtc-sdk";
// import React from 'react'
// import { Redirect } from "react-router-dom"

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/v1/user/register", userData)
    .then(res => history.push("/login")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/v1/user/login", userData)
    .then(res => {
      
      // Save to localStorage

      const  token  = res.data.token;
    //  console.log(res.data);
      localStorage.setItem("jwtToken", JSON.stringify(res.data));

      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      
      dispatch({
        
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
// Log user out
export const logoutUser = () => dispatch => {

  // Remove token from local storage
 // leave();
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  
};


// Log user out
export const joinConf = (channel) => dispatch => {
  localStorage.setItem("channel", channel);

  var retrievedObject = localStorage.getItem('jwtToken');
  var localstoragedata=JSON.parse(retrievedObject);


 // console.log("U are here");
  //console.log(localStorage);
  //return <Redirect to="/host" />;

  if(localstoragedata.userType == 1){
    window.location.href  = '/host'; // push user to dashboard when they login
   }else{
    window.location.href  = '/guest';
    //this.props.history.push("/dashboard");
   }
};
