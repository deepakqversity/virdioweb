import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, joinConf} from "../../actions/authActions";
import $ from 'jquery';
// import { joinConf } from "../../actions/authActions";
class Home extends Component {

  constructor(props){

    super(props);
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();

  };
  componentDidMount(){

  }

  joinOnClick = e => {
    let sessionId = document.getElementById('sessionId').value;
    e.preventDefault();

    // localStorage.setItem("channel", channel);
    localStorage.setItem("sessionId", sessionId);

    let localstoragedata = JSON.parse(localStorage.getItem('userData'));

    localStorage.setItem("load-page", 0);

    if(localstoragedata.userType == 1){
      // return <Redirect to="/host" />;
      this.props.history.push("/host");
     }else{
      // return <Redirect to="/guest" />;
      this.props.history.push("/guest");
     }
  };
render() {
    const  {user}  = this.props.auth;

   
   var retrievedObject = localStorage.getItem('userData');
   var localstoragedata=JSON.parse(retrievedObject);
return (
      <div className="container mt-5 valign-wrapper">
      <div className="row">
      <div className="text-white col-md-4 mx-auto d-table">
        <h4><b>Hey,</b> <span className="welcome-title">{localstoragedata.name.toLowerCase()}</span> <button onClick={this.onLogoutClick}
              className="btn btn-danger float-right">
              <i className="fa fa-power-off"></i>
            </button></h4>
      </div>
          
        </div>
      </div>
    );
  }
}
Home.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  joinConf: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser, joinConf }
)(Home);