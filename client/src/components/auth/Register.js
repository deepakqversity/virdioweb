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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      password2: "",
      errors: {}
    };
  }


  nextSlideFunc = (e) => {
    let v1 = $('radio[name=""]:ckecked').val();
    localStorage.setItem("userRegisterType", $('radio[name=""]:ckecked').val());
      this.props.history.push("/register");
    
    
    //this.props.history.push('/registerationform')
  }


  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    $("body").addClass("registration");
    //$("html").height("auto");
    $("body, div").bind('mousewheel', function() {
      return true
    });
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
    });
    $(".select-host").click(function(){
      if($(".select-host input").attr('checked', false)){
        $(".select-host input").attr('checked', true);
        $(".select-client input").removeAttr('checked');
      } 
    });
    
 

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
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.email,
      email: this.state.phone,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history); 
  };
render() {
    const { errors } = this.state;
return (
      <div className="container h-100" style={container}>
        <div className="h-100 d-flex align-items-center">
          <div className="register-page">
          
         
            <div className="col-md-7 col-lg-6 col-sm-6 text-light mx-auto">
                  <div className="col-12">
                    <p className="login-tagline">Sign up for</p>
                    <img src="/images/login-logo.png" className="login-logo" />
                  </div>
                  <div className="select-usertype">
                    <div className="col-sm-6 op1"  onClick={this.nextSlideFunc}>
                      <div className="select-client">
                        <img className="select-icon" src="/images/participate-icon.png" />
                        <input class="form-radio select-this" ref="abc" value="0" name="select-usertype" type="radio"  />
                        
                      </div>
                      <p className="text-right d-block float-right w-100">I want to participate in a session</p>
                    </div>
                    <div className="col-sm-6 op1" onClick={this.nextSlideFunc}>
                      <div className="select-host">
                        <img className="select-icon" src="/images/host-icon.png" />
                        <input class="form-radio select-this" ref="abc" value="1"  name="select-usertype" type="radio"  />
                        
                      </div>
                      <p className="text-left d-block float-left w-100">I want to host a session</p>
                    </div>
                    
                  </div>
              </div>
         
              
            
            
          </div>
          <div className="col-sm-8 d-none">
           
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.firstName}
                  error={errors.firstName}
                  id="firstName"
                  type="text"
                  className={classnames("", {
                    invalid: errors.firstName
                  })}
                />
                <label htmlFor="firstName">First Name</label>
                <span className="red-text">{errors.firstName}</span>
              </div>

              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.lastName}
                  error={errors.lastName}
                  id="lastName"
                  type="text"
                  className={classnames("", {
                    invalid: errors.lastName
                  })}
                />
                <label htmlFor="lastName">Last Name</label>
                <span className="red-text">{errors.lastName}</span>
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
                  value={this.state.phone}
                  error={errors.phone}
                  id="phone"
                  type="number"
                  className={classnames("", {
                    invalid: errors.phone
                  })}
                />
                <label htmlFor="phone">Phone</label>
                <span className="red-text">{errors.phone}</span>
                
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
const container = {
  "padding": "0px 15px",
  "max-width": "1140px"

};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));