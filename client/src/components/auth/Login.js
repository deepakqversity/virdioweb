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
      email: "",
      password: "",
      name:"",
      host:"1",
      client:"2",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/home");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/home"); // push user to dashboard when they login
    }
    this.props.history.push("/dashboard");

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
      name: this.state.name,
      type: this.state.type
    };
    console.log(userData);
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };
render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>

            <form className = "form-horizontal" role = "form"  noValidate onSubmit={this.onSubmit}>
            
            <div className = "form-group">
                <label for = "name" className = "col-sm-2 control-label">Name</label>
                <span className="red-text">{errors.name}{errors.nameincorrect}</span>
                <div className = "col-sm-10">
                  <input type="name"  id="name" onChange={this.onChange} value={this.state.name}  error={errors.name}  className={classnames("", { invalid: errors.name || errors.nameincorrect })} className = "form-control"  placeholder = "Enter  Name" />
                </div>
            </div>
            
            <div className = "form-group">
                <label for = "email" class = "col-sm-2 control-label">Email Id</label>
                <span className="red-text">{errors.name}{errors.nameincorrect} </span>
                <div className = "col-sm-10">
                  <input type="email"  id="email" value={this.state.email}  error={errors.email} onChange={this.onChange}  className={classnames("", {invalid: errors.email || errors.emailnotfound})} className = "form-control"  placeholder = "Enter Email" />
                </div>
            </div>
            
            <div className = "form-group">
                <div className = "col-sm-offset-2 col-sm-10">
                <div class = "radio">
            <label>
                <input type = "radio" name = "type" id = "host" onChange={this.handleChange} value = '1' checked={this.state.type === "1"} /> Host
            </label>
            </div>


            <div class = "radio">
            <label>
                <input type = "radio" name = "type" id = "client" onChange={this.handleChange} value = '2'  checked={this.state.type === "2"}  /> Client
            </label>
            </div>
            </div>
            </div>
   
            <div className = "form-group">
                <div className = "col-sm-offset-2 col-sm-10">
                  <button type = "submit" className = "btn btn-default"  className="btn btn-large btn-default waves-effect waves-light hoverable blue accent-3">Login</button>
                </div>
            </div>
            
          </form>      
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