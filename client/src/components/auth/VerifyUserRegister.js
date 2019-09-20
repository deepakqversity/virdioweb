import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, joinConf} from "../../actions/authActions";
import $ from 'jquery';

class VerifyUserRegister extends Component {
    componentDidMount(){
        $("body").addClass("registration");
        $(".click-sms").click(function(){
            $(".by-sms>div").css("background", "rgba(216,216,216,0.20)");
            $(".by-email>div").css("background", "rgba(216,216,216,0.10)");
            $(".otp-section").show();
            $(".link-section").hide();
          });
          $(".click-link").click(function(){
            $(".by-email>div").css("background", "rgba(216,216,216,0.20)");
            $(".by-sms>div").css("background", "rgba(216,216,216,0.10)");
            $(".otp-section").hide();
            $(".link-section").show();
          });
    }


    render(){
        return(
    <div className="container h-100" style={container}>
        <div className="h-100">
          <div className="">
            <div className="col-12">
              <img src="/images/host-icon.png" width="70" className="login-logo" />
              <p className="login-tagline">Signing up as a Host</p>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-12 col-lg-5 col-sm-12 col-12 mt-3">
                <div className="bg-gray2 p-4 rounded h-100">
                  <div className="signup-details">
                    <div className="col-md-12">
                      <span>First Name</span>
                      <p><img src="/images/login-user.png" />Arjun</p>
                    </div>
                    <div className="col-md-12">
                      <span>Last Name</span>
                      <p><img src="/images/login-user.png" />Rishi</p>
                    </div>
                    <div className="col-md-12">
                      <span>Email</span>
                      <p><img src="/images/form-email.png" />arjun.rishi@gmail.com</p>
                    </div>
                    <div className="col-md-12">
                      <span>Mobile Number</span>
                      <p><img src="/images/phone.png" />555 333 556</p>
                    </div>
                    <div className="col-md-12">
                      <span>Create a Password</span>
                      <p><img src="/images/password.png" />*******</p>
                    </div>
                    <div className="col-md-12">
                      <span>Retype Password</span>
                      <p><img src="/images/password.png" />*******</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-5  col-sm-12 col-12 mt-3">
                <div className="h-100 bg-gray2 p-4 rounded">
                  <div className="verify-details">
                    <h3 className="pb-3">Verify Your Account</h3>
                    <p>Where should we send you the verification code?</p>
                    <div className="sms-email d-flex justify-content-center">
                      <div className="by-sms mt-3">
                        <div>
                          <img src="/images/sms.png" />
                        </div>
                        <label className="mt-3 d-flex justify-content-center text-light click-sms">
                          <input className="form-radio top-0 mr-2" name="select-usertype" type="radio" /> 
                          <span className=" cursor-pointer">By SMS</span>
                        </label>
                        
                      </div>
                      <div className="by-email mt-3">
                        <div>
                          <img src="/images/email.png" />
                        </div>
                        <label className="mt-3 d-flex justify-content-center text-light click-link">
                          <input className="form-radio top-0 mr-2" name="select-usertype" type="radio" /> 
                          <span className=" cursor-pointer">By Email</span>
                        </label>
                      </div>
                    </div>
                    <div className="otp-section">
                      <h3 className="pt-4 pb-3 font-18">ENTER THE CODE</h3>
                      <div className="d-flex enter-otp justify-content-between align-items-center">
                        <input type="text" className="form-control" />
                        <p>Didn't receive? <a href="">RESEND</a></p>
                      </div>
                    </div>
                    <div className="link-section mt-5" style={{"display": "none"}}>
                      <p>Kindly check your email for varification link</p>
                      
                    </div>
                  </div>
                </div>
                <div className="mx-auto mb-3">
                  <a href="#" data-toggle="modal" data-target="#successModal"  className="btn btn-primary btn-register mx-auto d-table mt-3">DONE</a>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="modal" id="successModal">
            <div className="w-100 h-100 d-flex align-items-center background-overlay">
                <div className="modal-dialog bg-gray2 rounded">
                    <div className="modal-content bg-gray2 rounded dark-box-shadow">
                        <div className="signup-sucess text-center p-4">
                            <h3>Welcome to Virdio!</h3>
                            <p>Your registration was successful! As a host you can do many things on the platform. Would you like to see a tutorial ?</p>
                        </div>
                        <div className="signup-sucess d-flex justify-content-between pb-4 px-3 align-items-center">
                        <a href="#" class="btn btn-primary btn-register px-4">YES</a>
                        <a href="#" className="text-light">skip for now</a>
                        </div>
                    </div>
                </div>
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
export default connect()(VerifyUserRegister);