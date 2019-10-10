import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import axios from "axios";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "../../actions/types";

import $ from 'jquery';

class Forgotpassword extends Component {
            constructor() {
            super();
           // let email;
            this.state = {
                email:"",
                msg:"",
                showError:false,
                messageFromServer:'',
                type:"1",
                errors: {}
              };
        
            }

        componentDidMount() {

        }

        componentWillMount(){

        }

          
          handleChange= name => e => {
            this.setState({[name]: e.target.value});

          };

        sendEmail = e => {
          e.preventDefault();
     
          const userData = {
            email: this.state.email
          };
        
          if(this.state.email == "")
          {
            this.setState({
              msg: 'Email Should Not be Blank'
            });
          } else {

              console.log('-------------userData--------------',userData)

                axios
                .post("/api/v1/user/forgotpassword",userData)                
                .then(res => {

              console.log('---------forgotpasswd--------------',res.data)

                    if(res.data.responseData.message == 'Email doesn\'t exists in system')
                    {
                     
                          this.setState({
                            msg: res.data.responseData.message
                          });

                    }else if(res.data.responseData.message == 'email hasbeen sent to ur mail')
                    {
                      console.log('---------forgotpas--------------',res.data)
                        this.setState({
                          msg: res.data.responseData.message
                        });
                       
                    }

                })
                .catch(err =>{
                    console.log('there is problem');
                    // dispatch({
        
                    //   type: GET_ERRORS,
                    //   payload: err.response.data
                    // })
                });

            }
                    
          };

        render() {

            // const {email, messageFromServer, showNullError, showError, errors}=this.state;
            const {password,errors,isLoading,updated}=this.state;

        return (

            <div className="container">
            <div className="row">
              <div className="login-bg">
                <div className="login-box">
                  <div className="col-md-7 col-lg-5 col-sm-6 text-light mx-auto">
                  
                  <div className="col-12">
                    <img src="/images/login-logo.png" className="login-logo" />
                    <p className="login-tagline">Forgot Password</p>
                  </div>
                  <form className="form-horizontal pt-1" role = "form" noValidate onSubmit={this.sendEmail} autoComplete="off">
                  
                    <div className="login-inner">

                    {(
                    ()=>{
                        if(this.state.msg == "email hasbeen sent to ur mail") {
                          return  <div id="msg"  style={{color:'green'}}>{this.state.msg}</div>;
                        } else {
                      
                            return  <div id="msg"  style={{color:'red'}}>{this.state.msg}</div>;                     
                        }
                    }
                  )()}
                    {/* <span className="text-danger">{errors.email}{errors.emailincorrect}{errors.message}</span> */}
                    <div className="form-group pb-3 mb-0 mt-4">                        
                        <label>Enter your email address</label>
                        <input autoFocus type="email"  id="email" onChange={this.handleChange('email')} value={this.state.email} error={errors.email} className={classnames("", { invalid: errors.email || errors.emailincorrect }) + 'form-control'}  />
                      <img src="/images/login-user.png" className="user-login" />
                    </div>
                       
                    <div className="form-group pt-3 mb-4">
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                        
    
                          <button type = "button" className="btn-cancel btn btn-large btn-outline-secondary waves-effect waves-light hoverable blue accent-3 rounded p-3 px-4">Cancel</button>
                          <button type = "submit" className="btn-login btn btn-large btn-primary waves-effect waves-light hoverable blue accent-3 p-3 px-4 rounded">Submit</button>                        
                        </div>
                    </div>
                    
                  </div>
                                    
                </form> 
    
                </div>
                </div>
                <a href="#" className="privacy-link">Click to view the virdio privacy policy</a>
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

export default connect()(Forgotpassword);

