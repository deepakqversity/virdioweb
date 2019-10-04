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
            email:"",
            msg:"",
            password:"",
            cpassword:"",
            showError:false,
            type:"1",
            errors: {}
          };


    }


    componentDidMount() {

      let email=this.props.location.state.email;

      this.setState({
        email:this.props.location.state.email,
       
      });

    }

    componentWillMount(){

    }

    handleChange= name => e => {
        this.setState({[name]: e.target.value});
      };


      resetPassword = e => {
        e.preventDefault();
                     
        if(this.state.password == "" || this.state.cpassword == "")
        {
          this.setState({
            msg:'Password and Confirm Password field should not blank',
          });
        }else if(this.state.password != this.state.cpassword)
        {
          this.setState({
            msg:'Password and Confirm Password should be matched',
          });

        }else{

          const userData = {
            email: this.state.email,
            password: this.state.password
          };

          console.log('------update password------',userData)

            axios
            .put("/api/v1/user/update-password", userData)
            
            .then(res => {

                if(res.data.message == 'password updated')

                {
                 console.log('-------update------------',res.data.message)

              //    this.props.history.push({
              //     pathname: '/login',
              //     state: {msg: res.data.message}  
              // })

              this.setState({
                msg:res.data.message,                
                });


                 
                }else
                {
                  console.log('-------Not update------------',res.data.message)

                  this.setState({
                    msg:res.data.message,                
                    });
    
                }

            })
            .catch(err =>{
                console.log('there is problem');

                this.setState({
                  msg:'there is problem',                
                  });
            });

        }
                
      };


    render() {

        const {password,errors,isLoading,updated}=this.state;

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

                {(
                    ()=>{
                        if(this.state.msg == "password updated") {
                          return  <div id="msg"  style={{color:'green'}}>{this.state.msg}</div>;
                        } else {
                      
                            return  <div id="msg"  style={{color:'red'}}>{this.state.msg}</div>;                     
                        }
                    }
                  )()}
              
              
                <div className = "form-group mt-4 mb-0">
               
                    <span className="text-danger">{errors.password}{errors.passwordincorrect}{errors.message}</span>
                    <label>Enter your Password</label>
                    <input type="password"  id="password" onChange={this.handleChange('password')}  value={this.state.password} error={errors.password} className={classnames("", { invalid: errors.password || errors.passwordincorrect }) + 'form-control'} />
                   
                </div>
                
                <div className = "form-group mt-4 mb-0">
                   
                    <label> Confirm Password</label>
                    <input type="password"  id="cpassword" onChange={this.handleChange('cpassword')} value={this.state.cpassword}   className = "form-control"  />                  
                </div>
                
                <input type="hidden" name='email' id="email"  value={this.props.location.state.email}   className = "form-control"  /> 

                <div className = "form-group pt-3 mb-4">
                    <div className = "d-flex flex-wrap justify-content-between align-items-center">
                    

                      {/* <button type = "button" className="btn-cancel btn btn-large btn-outline-secondary waves-effect waves-light hoverable blue accent-3 rounded p-3 px-4">Cancel</button> */}
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