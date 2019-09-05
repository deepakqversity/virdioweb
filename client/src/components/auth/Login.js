import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email:"",
      password:"",
      type:"1",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      // this.props.history.push("/home");
      var localstoragedata=JSON.parse(localStorage.getItem('userData'));

      if(localstoragedata.userType == 1 && localstoragedata.sessionData.id != undefined){
        this.props.history.push("/host");
      }else if(localstoragedata.userType == 2 && localstoragedata.sessionData.id != undefined){
        this.props.history.push("/guest");
      } else {
        this.props.history.push("/home");
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {

      var localstoragedata=JSON.parse(localStorage.getItem('userData'));

      // this.props.history.push("/home"); // push user to dashboard when they login
        
      if(localstoragedata.userType == 1){
        this.props.history.push("/host");
      }else if(localstoragedata.userType == 2){
        this.props.history.push("/guest");
      } else {
        this.props.history.push("/home");
      }
    }


if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

 

onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleChange= e => {
    this.setState({type: e.target.value});
  };

onSubmit = e => {
    e.preventDefault();
      const userData = {
      email: this.state.email,
      password: this.state.password,
      // name: this.state.name,
      type: this.state.type
    };
   console.log(userData);
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };
render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div className="row">
          <div className="login-bg">
            <div className="login-box">
              <div className="col-md-7 col-lg-5 col-sm-6 text-light mx-auto">
              
              <div className="col-12">
                <img src="/images/login-logo.png" className="login-logo" />
                <p className="login-tagline">Login and Join a Virtual Studio</p>
              </div>
              <form className = "form-horizontal" role = "form"  noValidate onSubmit={this.onSubmit}>
                <div className="login-inner">
                <div className = "form-group mb-4 mt-2">
                    <span className="text-danger col-md-12">{errors.email}{errors.emailincorrect}{errors.message}</span>
                    <label>Enter your email id</label>
                    <input type="email"  id="email" onChange={this.onChange} value={this.state.email}  error={errors.email}  className={classnames("", { invalid: errors.email || errors.emailincorrect })} className = "form-control"  />
                  <img src="/images/login-user.png" className="user-login" />
                </div>

                <div className = "form-group mb-4">
                    <span className="text-danger col-md-12">{errors.password}{errors.passwordincorrect}</span>
                    <label>Password</label>
                    <input type="password"  id="password" onChange={this.onChange} value={this.state.password} error={errors.password} className={classnames("", { invalid: errors.password || errors.passwordincorrect })} className = "form-control"  />
                    <img src="/images/login-user.png" className="user-login" />
                </div>
                
                {/*<div className = "form-group">
                  <div class = "form-check-inline radio">
                      <label>
                          <input type = "radio" name = "type" id = "host" onChange={this.handleChange} value = '1' checked /> Host
                      </label>
                    </div>
                    <div class="form-check-inline radio">
                      <label>
                          <input type = "radio" name = "type" id = "client" onChange={this.handleChange} value = '2'  checked={this.state.type === "2"}  /> Client
                      </label>
                    </div>
                  </div>*/}
      
                <div className = "form-group pt-3 mb-4">
                    <div className = "d-flex flex-wrap justify-content-between align-items-center">
                      <button type = "submit" className="btn-cancel btn btn-large btn-outline-secondary waves-effect waves-light hoverable blue accent-3 rounded p-3 px-4">Cancel</button>
                      <button type = "submit" className="btn-login btn btn-large btn-primary waves-effect waves-light hoverable blue accent-3 p-3 px-4 rounded">Log in</button>
                      <a href="#" className="forgot-password mt-sm-0 mt-3">Forgot password?</a>
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);