import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
render() {
    const  {user}  = this.props.auth;

   // console.log(user);
    //console.log('------------------------------', user);

    var retrievedObject = localStorage.getItem('jwtToken');
    var localstoragedata=JSON.parse(retrievedObject);
  // console.log(JSON.parse(retrievedObject).name);

return (

        <div className="container">
            <header className="header bg-gray">
              <div className="row d-block d-md-flex align-items-center">
                <div className="col-12 col-md-1">
                  <a href="#" className="logo">
                    <img src="images/logo.png" />
                  </a>
                </div>
                <div className="col col-md-11">
                  <h3 className="main-heading">A long title that can come here <span>by host name</span></h3>
                  <div className="row justify-content-between align-items-center">
                    <div className="col col-md-7">
                      <div className="time">  <span>04/23/2019, at 12:00 PM</span>
                        <span>Time Remaining: 01:10:00</span>
                      </div>
                    </div>
                    <div className="col col-md-3 justify-content-end d-flex align-items-center">
                      <button className="border-right pr-20" onClick={this.onLogoutClick} className="btn btn-primary " tabIndex="1">Logout</button>
                      <div className="border-right pr-20">  <a href="#" className="btn btn-primary " tabIndex="1">details</a>
                      </div>
                      <img src="images/voice-commands.png" className="mic-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <section className="bg-gray mt-2 p-3 rounded section attendees">
              
              <div className="row one-gutters" id="subscribers-list"></div>
        
            </section>
            <div className="row four-gutters">
              <div className="col-12 col-md-12 mt-2 col-lg-12 host-section">
                <div className="bg-gray  p-3 rounded overflow-hidden h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="main-heading float-left">Streaming</h3>
                    <div className="host-header">
                      <img src="images/mute-microphone.png" className="unmute-icon" />
                      <img src="images/music-icon.png" className="music-icon" />
                      <img src="images/video-icon.png" className="video-icon" />
                      <img src="images/video-close.png" className="video-icon" />
                      <img src="images/circle.png" className="circle-icon" />
                    </div>
        
                    <div class="clearfix"></div>
                    <div className="row">
                        <div className="d-flex button-group">
                          <button id="join" className="btn btn-primary">Join</button>
                          <button id="leave" className="btn btn-primary">Leave</button>
                          <button id="publish" className="btn btn-primary">Publish</button>
                          <button id="unpublish" className="btn btn-primary">Unpublish</button>
                        </div>
                      </div>
                  </div>
                  <div id="agora_local" className="video-streams"></div>
                </div>
                
              </div>
              
            </div>
        
              
            
          </div>

    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);