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
      <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div className="row">
      <center>
        <h5 style={{ marginTop:"50px" }}>Join conference</h5>
        <div>Select Channel </div>
        <div>
        <select name="channel" id="channel" style={{ display:"inline-block" }} ><option value="1111">1111</option><option value="2222">2222</option></select>
        </div>
        <div><button type="button" id="join" onClick={this.joinOnClick}>Join</button></div>
      </center>
      
      
          <div className="col s12 center-align">
            <h4>
              <b>Hey,</b> {localstoragedata.name}
              <p className="flow-text grey-text text-darken-1">               
                <span>Virdio</span>
              </p>
            </h4>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
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