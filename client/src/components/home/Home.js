import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, joinConf} from "../../actions/authActions";
// import { joinConf } from "../../actions/authActions";
class Home extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();

  };

  joinOnClick = e => {
    let channel = document.getElementById('channel').value;
    e.preventDefault();
    console.log(this.props)
    this.props.joinConf(channel);
  };
render() {
    const  {user}  = this.props.auth;

   // console.log(user);
   
   var retrievedObject = localStorage.getItem('jwtToken');
   var localstoragedata=JSON.parse(retrievedObject);
return (
      <div className="container mt-5 valign-wrapper">
      <div className="row">
      <div className="text-white col-md-4 mx-auto d-table">
        <h4><b>Hey,</b> {localstoragedata.name} <button onClick={this.onLogoutClick}
              className="btn btn-danger float-right">
              <i className="fa fa-power-off"></i>
            </button></h4>
        
        <h5 style={{ marginTop:"50px" }}>To join conference please select channel</h5>
        
        <div>
        <select name="channel" id="channel" className="form-control" style={{ display:"inline-block" }} >
        <option value="2222">2222</option><option value="1111">1111</option></select>
        </div>
        <div><button type="button" className="mx-auto d-table mt-4 btn btn-primary" id="join" onClick={this.joinOnClick}>Join</button></div>
      
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