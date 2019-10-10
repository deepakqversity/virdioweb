import axios from "axios";
//import header from '../config.js';
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import $ from 'jquery';
import React from 'react'
import  { Redirect } from 'react-router-dom'
//import AgoraRTC from "agora-rtc-sdk";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";
import { resolve } from "url";

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

// All User
// export const allUsers = sessionId => dispatch => {
//   axios
//     .get("/api/v1/session/"+sessionId+"/users",{headers: header})
//     .then(res =>{
//       console.log('--------mmmmmmmmmmmmm---------',res.data);
//       return res.data;
//     })
//     // .catch(err =>
//     //   dispatch({
//     //     type: GET_ERRORS,
//     //     payload: err.response.data
//     //   })
//     // );   
// };

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/v1/user/login", userData)
    .then(res => {
      
      // Save to localStorage

      const  token  = res.data.responseData.token;

       if ($('#remember_me').is(':checked')) {
          // save username and password
          localStorage.email = $('#email').val();
          localStorage.chkbx = $('#remember_me').val();
      } else {

          localStorage.removeItem('email');
          localStorage.removeItem('chkbx');
      }
    
      localStorage.setItem("userData", JSON.stringify(res.data.responseData));

      console.log('error1---------res.data----------',res.data)
      

      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // console.log('decoded ===========',decoded)
      // Set current user
      console.log('err2---------res.data----------',decoded)
      dispatch(setCurrentUser(decoded))
      
    })
    .catch(err =>
      
     { 

    console.log('err----------res.data-----', err);
    
      dispatch({
             
             type: GET_ERRORS,
             payload: err.response.data
           })
          
          }

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
  localStorage.removeItem("userData");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  
};


// Log user out
export const joinConf = (channel) => dispatch => {
  localStorage.setItem("channel", channel);

  var retrievedObject = localStorage.getItem('userData');
  var localstoragedata=JSON.parse(retrievedObject);


 console.log("U are here");
  console.log(localStorage);

  if(localstoragedata.userType == 1){
    // return <Redirect to="/host" />;
    this.props.history.push("/host");
    // window.location.href  = '/host'; // push user to dashboard when they login
   }else{
    // return <Redirect to="/guest" />;
    this.props.history.push("/guest");
    // window.location.href  = '/guest';
    //this.props.history.push("/dashboard");
   }
};

// Log user out
export const addLogs = (sessionId, userType, type) => dispatch => {
  console.log("sessionId, userType, type === ", sessionId, userType, type);
  var logData = {
    sessionId : sessionId,
    userType : userType,
    type : type
  };
  var userData = JSON.parse(localStorage.getItem("userData"));

  // fetch("/api/v1/session/activity-log", {
  //   method: 'POST',
  //   body: JSON.stringify(logData),
  //   headers : {'Authorization': userData.token}
  // })
  // .then(response => response.json())
  // // ...then we update the users state
  // .then(data => {
  //   console.log('successfully saved', data)
  // });

  axios.post('/api/v1/session/activity-log', logData)
  .then(function (response) {
    console.log('successfully saved')
  })
  .catch(function (error) {
    console.log(error);
  });

};