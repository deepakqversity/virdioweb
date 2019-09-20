import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, joinConf} from "../../actions/authActions";
import $ from 'jquery';

class RegisterForm extends Component {


    nextSlideFunc = (e) => {
        e.preventDefault();
        
          this.props.history.push("/verify-status");

        //this.props.history.push('/registerationform')
      }


    render(){
        return (
        <div className="container h-100" style={container}>
            <div className="h-100 d-flex align-items-center">
                <div className="register-page">
                <div className="">
                  <img src="/images/host-icon.png" width="70" className="login-logo" />
                      <p className="login-tagline">Signing up as a Host</p>
                      
                </div>
                <div className="col-md-6 register-box mx-auto">
                  <div className="form-horizontal">
                  <div className="register-inner">
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Email field is required</span>
                      <label>Enter First name</label>
                      <input type="text" className="form-control" />
                      <img src="/images/login-user.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Password field is required</span>
                      <label>Enter Last name</label>
                      <input type="text" className="form-control" />
                      <img src="/images/login-user.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Password field is required</span>
                      <label>Email Address</label>
                      <input type="email" className="form-control" />
                      <img src="/images/form-email.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Password field is required</span>
                      <label>Mobile Number</label>
                      <input type="text" className="form-control" />
                      <img src="/images/phone.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Password field is required</span>
                      <label>Create a Password</label>
                      <input type="password" className="form-control" />
                      <img src="/images/password.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Password field is required</span>
                      <label>Retype Password</label>
                      <input type="password" className="form-control" />
                      <img src="/images/password.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      
                    </div>
                  </div>
                  </div>
                </div>
                <div className="col-md-6 mx-auto">
                  <a href="#" onClick={this.nextSlideFunc}  className="btn btn-primary btn-register mx-auto d-table mt-3">VERIFY</a>
                </div>
              </div>
            </div>
        </div>
        )
    }
}

const container = {
    "padding": "0px 15px",
    "max-width": "1140px"
  
  };


export default connect()(RegisterForm);