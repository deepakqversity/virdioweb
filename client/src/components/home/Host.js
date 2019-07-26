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

  componentDidMount(){
  // console.log(2);    //
  }
  componentWillMount(){
    //console.log(1);
    // window.test();
  }
render() {
    const  {user}  = this.props.auth;

   // console.log(user);
    console.log('------------------------------', user);

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
              <div className="border-right pr-20">  <a href="#" className="btn btn-primary " tabIndex="1">details</a>
              </div>
              <img src="images/voice-commands.png" className="mic-icon" />
            </div>
          </div>
        </div>
      </div>
    </header>
    <section className="bg-gray mt-2 p-3 rounded section attendees">
      <div className="row px-3 py-2 justify-content-between align-items-center">
        <div className="col-6 col-md-6">
          <h4 className="title">Wine Testers <span>(24/44)</span></h4>
        </div>
        <div className="col-6 col-md-4">
          <button type="button" className="btn btn-outline-secondary float-right">"Show Attendees"</button>
        </div>
      </div>
      <div className="row one-gutters">

        <div className="col-md-4 col-lg-3 col-sm-6 col-6">
          <div className="video-holder position-relative">
            <img src="images/a1.png" /> <span className="hand-icon position-absolute"></span>
            
            <div className="att-details"> <span className="att-name">James K, TX</span>
              <span className="icon1"></span>
              
            </div>
          </div>
        </div>
        
        <div className="col-md-4 col-lg-3 col-sm-6 col-6">
          <div className="video-holder position-relative">
            <img src="images/a8.png" />
            
            <div className="att-details"> <span className="att-name">Michelle U, LA</span>
            
              <span className="icon2"></span>
            </div>
          </div>
        </div>
        
      </div>
    </section>
    <div className="row four-gutters">
      <div className="col-12 col-md-12 mt-2 col-lg-5 host-section">
        <div className="bg-gray  p-3 rounded overflow-hidden h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="main-heading float-left">Streaming</h3>
            <div className="host-header">
              <img src="images/mute-microphone.png" className="unmute-icon" />
              <img src="images/music-icon.png" className="music-icon" />
              <img src="images/video-icon.png" className="video-icon" />
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
      <div className="col-12 col-md-12 mt-2 col-lg-7">
        <div className="bg-gray  p-3 rounded overflow-hidden h-100">
          <div className="d-md-flex justify-content-between align-items-center mb-3">
            <h3 className="main-heading">Testing Script <span>1/4 wines</span></h3>
            <div className="col-12 mt-3 mt-md-0 col-md-4 d-md-flex justify-content-between align-items-center">
              <button type="button" className="btn btn-outline-secondary">"Show Script"</button>
              <img src="images/next-icon.png" className="next-btn" />
            </div>
          </div>
          <div className="item-description">
            <h4 className="item-name">2014 Bliss Block Pinot Noir</h4>
            <div className="row">
              <ul className="col-12 col-md-12 col-lg-5 list-info">
                <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                <li><span>Year</span><span>2014​</span></li>
                <li><span>Country</span><span>United States​</span></li>
                <li><span>Appellation</span><span>Sonoma</span></li>
                <li><span>Alcohol</span><span>14.3%</span></li> 
              </ul>
              <ul className="col-12 col-md-12 col-lg-7 list-info">
                <li><span>pH</span><span>3.69</span></li>
                <li><span>Aging</span><span>15 months in French Oak Barrels, 82%</span></li>
                <li><span>Price</span><span>$80​</span></li>
                <li><span>Case Production</span><span>250</span></li>
              </ul>
              <div className="col col-md-12">
                <p className="item-text">The Bliss Block Pinot Noir beautifully captures the rich spice qualities that are characteristic of this cool pocket of our Quail Hill Estate vineyard. A bright garnet hue </p>
              </div>
            </div>
          </div>
        </div>
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