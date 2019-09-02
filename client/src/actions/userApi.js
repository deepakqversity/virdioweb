import {header} from '../config.js';
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import $ from 'jquery';
import React from 'react'
import  { Redirect } from 'react-router-dom'

class UserApi { 

    allUsers = async (sessionId) => {
    let userUrl = "/api/v1/session/"+sessionId+"/users";
  return await fetch(userUrl, {
    method: 'get',
    headers: header    
  })
      .then(response => response.json())
      .then(res => {
          console.log(res)
        return res;
      })
      .catch(error => ({ error }));
    } 
}

export default new UserApi();