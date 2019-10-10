import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import axios from "axios";
import  { Redirect } from 'react-router-dom'


import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "../../actions/types";

import $ from 'jquery';

class Verifylink extends Component {
            constructor() {
            super();
           // let email;
            this.state = {
                email:"",
                showError:false,
                messageFromServer:'',
                type:"1",
                errors: {}
              };
        
            }

        componentDidMount() {

          this.verifyEmail();
        }

        componentWillMount(){
          
        }

          
          verifyEmail = e => {
    
         console.log('------------veryfylink-------------------')

         let path=window.location.pathname;

         console.log('------path----------',path)

         let path_arr = path.split("/");

         console.log('------path_arr----------',path_arr[1])

         const userData = {
          email: path_arr[2],
          otpcode: path_arr[3]
        };

         axios
         .post("/api/v1/user/verify-link",userData)                
         .then(res => {

          console.log('---------verifylink123333--------------',res.data)

          if(res.data.message == 'OTP is not Valid')
          {
            this.props.history.push("/login");
       

          }else if(res.data.message == 'Email not exists in system')
          {
            this.props.history.push("/login");
     
             
          }else if(res.data.message == 'your link is verified')
          {
            this.props.history.push({
              pathname: '/reset-password',
              state: {email: res.data.link}  
          })
            //this.props.history.push("/reset-password");
          }

        })
      
                        
          };

        render() {

        return (

            <div className="container">
            <div className="row">
              <div className="login-bg">

                ----------This is Verify link------------
             
              </div>              
            </div>
          </div>

         );

         }

}

const container = {
    "padding": "0px 15px",
    "max-width": "1140px"
  
  };

export default connect()(Verifylink);

