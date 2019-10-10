import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

import $ from 'jquery';

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
    $('#email').on('focus', function() {
      //document.body.scrollTop = $(this).offset().top;
      document.body.scrollTop = 200;
  
  });
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      // this.props.history.push("/home");
      var localstoragedata=JSON.parse(localStorage.getItem('userData'));

      // if(localstoragedata.userType == 1 && localstoragedata.sessionData.id != undefined){
      //   this.props.history.push("/host");
      // }else if(localstoragedata.userType == 2 && localstoragedata.sessionData.id != undefined){
      //   this.props.history.push("/guest");
      // } else {
      //   this.props.history.push("/home");
      // }

      if(localstoragedata && localstoragedata.sessionData && localstoragedata.sessionData.id != undefined){
        this.props.history.push("/pre-screen");
      } else {
        this.props.history.push("/home");
      }
      
    } else {
      if (localStorage.chkbx && localStorage.chkbx != '') {
          $('#remember_me').attr('checked', 'checked');
          // $('#email').val(localStorage.email);
          this.setState({email:localStorage.email})
      } else {
          $('#remember_me').removeAttr('checked');
          // $('#email').val('');
          this.setState({email:''})
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {

      var localstoragedata = JSON.parse(localStorage.getItem('userData'));

      // this.props.history.push("/home"); // push user to dashboard when they login
        
      // if(localstoragedata.userType == 1){
      //   this.props.history.push("/host");
      // }else if(localstoragedata.userType == 2){
      //   this.props.history.push("/guest");
      // } else {
      //   this.props.history.push("/home");
      // }

      if(localstoragedata && localstoragedata.sessionData && localstoragedata.sessionData.id != undefined){
        this.props.history.push("/pre-screen");
      } else {
        this.props.history.push("/home");
      }
    }


if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors.errorData
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

    console.log('---------hello---------------')
      const userData = {
      email: this.state.email,
      password: this.state.password,
      // name: this.state.name,
      type: this.state.type
    };
   console.log('------------userData1111---------------',this.state.email)
   console.log('------------userData111134---------------',userData)
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
              <form className = "form-horizontal pt-1" role = "form"  noValidate onSubmit={this.onSubmit} autoComplete="off">
              
                <div className="login-inner">
                <div className = "form-group pb-3 mb-0 mt-4">
                    <span className="text-danger">{errors.email}{errors.emailincorrect}</span>
                    <label>Enter your email address</label>
                    <input autoFocus type="email"  id="email" onChange={this.onChange} value={this.state.email}  error={errors.email}  className={classnames("", { invalid: errors.email || errors.emailincorrect })} className = "form-control"  />
                  <img src="/images/login-user.png" className="user-login" />
                </div>

                <div className = "form-group mt-4 mb-0">
                    <span className="text-danger">{errors.password}{errors.passwordincorrect}</span>
                    <label>Password</label>
                    <input type="password"  id="password" onChange={this.onChange} value={this.state.password} error={errors.password} className={classnames("", { invalid: errors.password || errors.passwordincorrect })} className = "form-control"  />
                    <img src="/images/login-user.png" className="user-login" />
                </div>
                
                <div className = "form-group mt-4 mb-0 pl-0">
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" value="remember-me" id="remember_me" name="example1" />
                    <label className="custom-control-label" htmlFor="remember_me">Remember me</label>
                  </div>
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
                    

                      <button type = "button" className="btn-cancel btn btn-large btn-outline-secondary waves-effect waves-light hoverable blue accent-3 rounded p-3 px-4">Cancel</button>
                      <button type = "submit" className="btn-login btn btn-large btn-primary waves-effect waves-light hoverable blue accent-3 p-3 px-4 rounded">Log in</button>
                      <a href="/forgot-password"  className="open-list" className="forgot-password mt-sm-0 mt-3">Forgot password?</a>
                    </div>
                </div>
                
              </div>
              
              
            </form> 

            </div>
            </div>
            <a href="/privacy-policy.html" target="_blank" className="privacy-link">Click to view the virdio privacy policy</a>
          </div>
          
        </div>

        {/* <div className="modal attendy-list" id="attendy-list">
        <div className="modal-dialog">
          <div className="modal-content">
           
           
            <div className="modal-header">
              <h4 className="modal-title">Enter Your Email ID</h4>
              <button type="button" className="close" data-dismiss="modal">×</button>
            </div>
           
            <div className="modal-body">
            <table className="table">
              <thead>
             
              </thead>
              <tbody>
              <form className = "form-horizontal pt-1" role = "form"  noValidate onSubmit={this.sendEmail} autocomplete="off">
               <tr>                 
                 <td>
                 <input type="email"  id="emailID"  value={this.state.emailID} onChange={this.handleChange(emailID)}  error={errors.email}  className={classnames("", { invalid: errors.email || errors.emailincorrect })} className = "form-control"  />
                   </td>
                 </tr> 
                 <tr>
                   <td>
                   <button type = "button" className="btn-login btn btn-large btn-primary waves-effect waves-light hoverable blue accent-3 p-3 px-4 rounded" id="forgot-password" onClick={this.sendMail.bind(this)}>Submit</button>
                   </td>
                  </tr> 
                  </form>         
              </tbody>
            </table>
            </div>
            
          </div>
        </div>
      </div> */}
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
  errors: state.user
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);