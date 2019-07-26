import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
class Host extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  joinOnClick = e => {
    e.preventDefault();
    let channel = document.getElementById('channel').value;
    this.props.joinConf(channel);
  };

render() {
    const  {user}  = this.props.auth;

   // console.log(user);
    console.log('------------------------------', user);

return (
    <div className="container valign-wrapper">
      <div className="row">
        <h4 style={{ marginTop:"50px", textAlign:"center" }}>Welcome</h4>
        <div id="div_device" className="panel panel-default hide">
          <div className="container">
            <div className="col-md-12">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="audioSource">Audio source: </label>
                  <select className="form-control" id="audioSource"></select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="videoSource">Video source: </label>
                  <select className="form-control" id="videoSource"></select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div id="div_join" className="panel panel-default">
          <div className="panel-body ">
            <div className="container d-flex">
              <div className="col-md-3">
                App ID: <input id="appId" className="form-control" type="text" defaultValue="232f270a5aeb4e0097d8b5ceb8c24ab3" size="36" />
              </div>
              <div className="col-md-3">
                Channel: <input id="channel" className="form-control" type="text" defaultValue="1000" size="4" />
              </div>
              <div className="col-md-3 hide">
                <input id="video" type="checkbox" defaultChecked="checked" style={{opacity:"1", pointerEvents:"inherit"}} />
              </div>
              <div className="row">
                <div className="d-flex button-group">
                  <button id="join" className="btn btn-primary">Join</button>
                  <button id="leave" className="btn btn-primary">Leave</button>
                  <button id="publish" className="btn btn-primary">Publish</button>
                  <button id="unpublish" className="btn btn-primary">Unpublish</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div id="video">
          <div id="agora_local" className="col-md-2" ></div>
          <div className="container">
            <div className="col-md-10"></div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          
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
Host.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Host);