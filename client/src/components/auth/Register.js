import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import $ from "jquery";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    $(".select-usertype>div:nth-child(1)").click(function(){
      $(this).addClass("op1").removeClass("op3");
      $(".select-usertype>div:nth-child(2)").removeClass("op1").addClass("op3");
      
    })
    $(".select-usertype>div:nth-child(2)").click(function(){
      $(this).addClass("op1").removeClass("op3");
      $(".select-usertype>div:nth-child(1)").removeClass("op1").addClass("op3");
      
    })
    
    $(".select-client").click(function(){
      if($(".select-client input").attr('checked', false)){
        $(".select-client input").attr('checked', true);
        $(".select-host input").removeAttr('checked');
      } 
    } );
    $(".select-host").click(function(){
      if($(".select-host input").attr('checked', false)){
        $(".select-host input").attr('checked', true);
        $(".select-client input").removeAttr('checked');
      } 
    } );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }



onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history); 
  };
render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div className="row">
          <div className="register-page">
          <div id="carouselExampleControls" className="carousel slide carousel-fade w-100" data-ride="carousel"  data-interval="false">
            <div className="carousel-inner">
              <div className="carousel-item ">
                <div className="col-md-7 col-lg-6 col-sm-6 text-light mx-auto">
                  <div className="col-12">
                    <p className="login-tagline">Sign up for</p>
                    <img src="/images/login-logo.png" className="login-logo" />
                  </div>
                  <div className="select-usertype">
                    <div className="col-sm-6 op1" data-slide="next"  data-target="#carouselExampleControls">
                      <div className="select-client">
                        <img className="select-icon" src="/images/participate-icon.png" />
                        <input class="form-radio select-this" name="select-usertype" type="radio" />
                        
                      </div>
                      <p className="text-right d-block float-right w-100">I want to participate in a session</p>
                    </div>
                    <div className="col-sm-6 op1" data-slide="next"  data-target="#carouselExampleControls">
                      <div className="select-host">
                        <img className="select-icon" src="/images/host-icon.png" />
                        <input class="form-radio select-this" name="select-usertype" type="radio" />
                        
                      </div>
                      <p className="text-left d-block float-left w-100">I want to host a session</p>
                    </div>
                    
                  </div>
              </div>
              </div>
              <div className="carousel-item ">
                <div className="col-12">
                  <img src="/images/login-logo.png" className="login-logo" />
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
                      <img src="/images/login-user.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Password field is required</span>
                      <label>Mobile Number</label>
                      <input type="text" className="form-control" />
                      <img src="/images/login-user.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Password field is required</span>
                      <label>Create a Password</label>
                      <input type="password" className="form-control" />
                      <img src="/images/login-user.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      <span className="text-danger invisible col-md-12">Password field is required</span>
                      <label>Retype Password</label>
                      <input type="password" className="form-control" />
                      <img src="/images/login-user.png" className="user-login" />
                    </div>
                    <div className="form-group">
                      
                    </div>
                  </div>
                  </div>
                </div>
                <div className="col-md-6 mx-auto">
                  <a href="#carouselExampleControls"  data-slide="next"  className="btn btn-primary btn-register mx-auto d-table mt-3">VERIFY</a>
                </div>
              </div>
              <div className="carousel-item active">
                <div className="col-12">
                  <img src="/images/login-logo.png" className="login-logo" />
                      <p className="login-tagline">Signing up as a Host</p>
                      
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-5 col-lg-5 col-sm-6 col-12 ">
                    <div className="bg-gray2 p-4 rounded">
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
                          <p><img src="/images/login-user.png" />arjun.rishi@gmail.com</p>
                        </div>
                        <div className="col-md-12">
                          <span>Mobile Number</span>
                          <p><img src="/images/login-user.png" />555 333 556</p>
                        </div>
                        <div className="col-md-12">
                          <span>Create a Password</span>
                          <p><img src="/images/login-user.png" />*******</p>
                        </div>
                        <div className="col-md-12">
                          <span>Retype Password</span>
                          <p><img src="/images/login-user.png" />*******</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 col-lg-5 col-sm-6 col-12 ">
                    <div className="bg-gray2 p-4 rounded">
                      <div className="verify-details">
                        <h3 className="pb-3">Verify Your Account</h3>
                        <p>Where should we send you the verification code?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
          </div>
            
          </div>
          <div className="col-sm-8 d-none">
           
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="name">Name</label>
                <span className="red-text">{errors.name}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
                
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"

                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">{errors.password}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <label htmlFor="password2">Confirm Password</label>
                <span className="red-text">{errors.password2}</span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}



Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));