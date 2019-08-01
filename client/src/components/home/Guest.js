import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
class Guest extends Component {
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
    <div className="container overlay position-relative">

      <div id="agora_host" className="fix-host"></div>
      
    <header className="header">
      <div className="row">
        <div className="col-lg-9 col-md-12 pr-0">
          <div className="transparent-gray">
            <div className="row">
              <a href="#" className=" py-xs-1 col-lg-1 col-md-1 col-sm-12 d-flex justify-content-center align-items-center v-logo">
                <img src="images/v-logo.png" />
                              </a>
              <div className="col-lg-11 col-md-11 col-sm-12">
                <div className="row justify-content-between align-items-center">
                  <div className="col-lg-10 text-center text-md-left col-sm-12">
                    <div className="time py-xs-1">  <span>04/23/2019, at 12:00 PM</span>
                      <span>Time Remaining: 01:10:00</span>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-12 justify-content-end d-flex align-items-center ">
                    <a className="btn btn-primary mx-xs-auto " href="#" className="btn btn-primary " tabIndex="1">Details</a>
                    <button className="btn btn-primary ml-2" onClick={this.onLogoutClick} tabIndex="1"><i className="fa fa-power-off"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div className="col-lg-3 col-md-12 d-md-flex align-items-center">
          <div className="default-btns py-xs-1">
            <a href="javascript:;" className="btn btn-primary px-4 rounded m-1"><img src="images/hand.png" /></a>
            <a href="javascript:;" className="btn btn-outline-secondary px-4 rounded m-1" id="broadcaster"><img src="images/video-icon.png" className="video-icon" /></a>
              <a href="javascript:;" className="btn btn-outline-secondary px-4 rounded m-1" id="audience"><img src="images/video-close.png" className="video-icon" /></a>

          </div>
        </div>
      </div>
      
    </header>
    <div className="row justify-content-between zindex-5 position-relative">
    <div className="col-lg-3 col-md-4 col-sm-5 col-6">
      <div className="left-section">
        <h2 className="item-name py-3">1/4 Wines</h2>
        <h3 className="second-heading my-3">2014 Bliss Block Pinot Noir</h3>
        <div className="video-holder">
          <img src="images/Rectangle.png" />
        </div>
        
        <div className="item-description py-4">
          <div className="row">
            <ul className="col-12 col-md-12 list-info my-0">
              <li><span>Varietal</span><span>100% Pinot Noir</span></li>
              <li><span>Year</span><span>2014​</span></li>
              <li><span>Country</span><span>United States​</span></li>
              <li><span>Appellation</span><span>Sonoma</span></li>
              <li><span>Alcohol</span><span>14.3%</span></li> 
            </ul>
            <ul className="col-12 col-md-12 list-info my-0">
              <li><span>pH</span><span>3.69</span></li>
              <li><span>Aging</span><span>15 months in French Oak Barrels, 82%</span></li>
              <li><span>Price</span><span>$80​</span></li>
              <li><span>Case Production</span><span>250</span></li>
            </ul>
            
          </div>
        </div>
        <button type="button" className="btn btn-outline-secondary">"Show Details"</button>
      </div>
    </div>
    <div className="col-lg-3 col-md-4 col-sm-5 col-6 float-right pl-0">
        <div className="right-sidebar">
          <div className="transparent-gray slide-right-left">
            <h4 className="title mb-2">Wine Testers <span>(24/44)</span></h4>
            <div className="joined-attendees">
              <div className="attendee-list">
                <img src="images/attendee.png" />
                <span>
                  Edward K
                  <span><i className="fa fa-map-marker" aria-hidden="true"></i> CO</span>
                </span>
                <div className="vid-icons">
                  <span className="icon1"></span>
                  <span className="icon2"></span>
                </div>
              </div>
              <div className="attendee-list">
                <img src="images/attendee.png" />
                <span>
                  Edward K
                  <span><i className="fa fa-map-marker" aria-hidden="true"></i> CO</span>
                </span>
                <div className="vid-icons">
                    <span className="icon1"></span>
                </div>
                
              </div>
              <div className="attendee-list">
                <img src="images/attendee.png" />
                <span>
                  Edward K
                  <span><i className="fa fa-map-marker" aria-hidden="true"></i> CO</span>
                </span>
                
                <div className="vid-icons">
                    <span className="icon2"></span>
                </div>
              </div>
              <div className="attendee-list">
                <img src="images/attendee.png" />
                <span>
                  Edward K
                  <span><i className="fa fa-map-marker" aria-hidden="true"></i> CO</span>
                </span>
              </div>
              <div className="attendee-list">
                <img src="images/attendee.png" />
                <span>
                  Edward K
                  <span><i className="fa fa-map-marker" aria-hidden="true"></i> CO</span>
                </span>
              </div>
              <div className="attendee-list">
                  <img src="images/attendee.png" />
                  <span>
                    Edward K
                    <span><i className="fa fa-map-marker" aria-hidden="true"></i> CO</span>
                  </span>
                </div>
              <div className="attendee-list">
                <img src="images/attendee.png" />
                <span>
                  Edward K
                  <span><i className="fa fa-map-marker" aria-hidden="true"></i> CO</span>
                </span>
              </div>
              <div className="attendee-list">
                <img src="images/attendee.png" />
                <span>
                  Edward K
                  <span><i className="fa fa-map-marker" aria-hidden="true"></i> CO</span>
                </span>
              </div>
              
            </div>
            <button type="button" className="minimize-others btn btn-outline-secondary mt-3 mx-auto d-table">"Minimize others"</button>
            
            <div className="self-video mt-3">
              <div id="agora_local" className="video-streams"></div>
            </div>
          </div>
          
        </div>
      
    </div>
  </div>
    <footer className="footer position-relative zindex-5">
      
      <ul className="bottom-links flex-wrap list-group list-group-horizontal mx-auto d-md-flex justify-content-center py-xs-1">
        <li className="list-group-item bg-transparent border-0"><a href="#">APPEARANCE</a></li>
        <li className="list-group-item bg-transparent border-0"><a href="#">AROMA</a></li>
        <li className="list-group-item bg-transparent border-0"><a href="#">PALATE</a></li>
        <li className="list-group-item bg-transparent border-0"><a href="#">SCORE</a></li>
      </ul>
      
      <div className="self-video1 mt-3">
          <button type="button" className="show-everyone btn btn-outline-secondary mb-3 mx-auto">"Show everyone"</button>
        <video autoPlay loop muted>
          <source src="images/video.mp4" type="video/mp4" />
        </video>
      </div>
    </footer>

    <input type="hidden" id="conf-page" />

  </div>
    );
  }
}
Guest.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Guest);