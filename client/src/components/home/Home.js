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

render() {

  const  {user}  = this.props.auth;
 
  var localstoragedata = JSON.parse(localStorage.getItem('userData'));
  
  return (
      <div className="container mt-5 valign-wrapper">
        <div className="row">
          <div className="text-white col-md-4 mx-auto d-table">
            <h4><b>Hey,</b> <span className="welcome-title">{localstoragedata.firstName.toLowerCase()}</span> <button onClick={this.onLogoutClick}
                  className="btn btn-danger float-right">
                  <i className="fa fa-power-off"></i>
                </button></h4>
                {
                  localstoragedata.sessionData.id != undefined ? ( 
                  <div>{ localstoragedata.sessionData.message }</div> 
                  ) : ( 
                  <div> </div> 
                  )
                }
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