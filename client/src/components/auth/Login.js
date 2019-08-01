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
      name:"",
      type:"1",
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

      var retrievedObject = localStorage.getItem('jwtToken');
      var localstoragedata=JSON.parse(retrievedObject);

      this.props.history.push("/home"); // push user to dashboard when they login

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
      name: this.state.name,
      type: this.state.type
    };
   // console.log(userData);
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };
render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col-md-4 text-light mx-auto">
            
            <div className="col-12">
              <h4>
                <b>Login</b> below
              </h4>
              
            </div>
            <form className = "form-horizontal" role = "form"  noValidate onSubmit={this.onSubmit}>
            
            <div className = "form-group">
                <span className="text-danger col-md-12">{errors.name}{errors.nameincorrect}{errors.message}</span>
                <div className = "col-sm-10">
                  <input type="name"  id="name" onChange={this.onChange} value={this.state.name}  error={errors.name}  className={classnames("", { invalid: errors.name || errors.nameincorrect })} className = "form-control"  placeholder = "Username" />
                </div>
            </div>
            
            <div className = "form-group">
              <div className = "col-sm-12">
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


            
            </div>
            </div>
   
            <div className = "form-group">
                <div className = "col-sm-offset-2 col-sm-10">
                  <button type = "submit" className="btn btn-large btn-primary waves-effect waves-light hoverable blue accent-3">Login</button>
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