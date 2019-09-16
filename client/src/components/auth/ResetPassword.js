import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import axios from "axios";

import $ from 'jquery';

class ResetPassword extends Component {
    constructor() {
        super();

        this.state = {
            email:"lalit@test.com",
            password:"",
            cpassword:"",
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


      resetPassword = e => {
        e.preventDefault();
              
       //alert(this.state.password);return false;
       const userData = {
        email: this.state.email,
        password: this.state.password
      };
    
        if(this.state.email == "" || this.state.password == "")
        {
          this.setState({
            updated:false,
            error:true,
          });
        }else{

            axios
            .post("/api/v1/user/updatePassword", userData)
            
            .then(res => {

                if(res.data == 'password updated')

                {
                    this.setState({
                        updated:true,
                            error:false,
                      });
                }else
                {
                    this.setState({
                        updated:false,
                        error:true,
                      });
                }

            })
            .catch(err =>{
                console.log('there is problem');
            });

        }
                
      };


    render() {

        const {password,error,isLoading,updated}=this.state;

    return (

        <div className="container">
        <div className="row">
          <div className="login-bg">
            <div className="login-box">
              <div className="col-md-7 col-lg-5 col-sm-6 text-light mx-auto">
              
              <div className="col-12">
                <img src="/images/login-logo.png" className="login-logo" />
                <p className="login-tagline">Update Password</p>
              </div>
              <form className = "form-horizontal pt-1" role = "form"  noValidate onSubmit={this.resetPassword} autocomplete="off">
              
                <div className="login-inner">
                <div className = "form-group pb-3 mb-0 mt-4">
                    {/* <span className="text-danger">{errors.email}{errors.emailincorrect}{errors.message}</span> */}
                    
                    <input type="email"  id="email" onChange={this.handleChange('email')}  value={'lalit@test.com'}  className = "form-control"  />
                  
                </div>

                <div className = "form-group mt-4 mb-0">
                    {/* <span className="text-danger">{errors.password}{errors.passwordincorrect}</span> */}
                   
                    <input type="password"  id="password" onChange={this.handleChange('password')} value={this.state.password}   className = "form-control" placeholder="password" />
                   
                </div>
                {/* 
                <div className = "form-group mt-4 mb-0">
                   
                    <label> Confirm Password</label>
                    <input type="password"  id="cpassword" onChange={this.handleChange('cpassword')} value={this.state.password}   className = "form-control"  />
                  
                </div> */}
                
                   
                <div className = "form-group pt-3 mb-4">
                    <div className = "d-flex flex-wrap justify-content-between align-items-center">
                    

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


export default connect()(ResetPassword);