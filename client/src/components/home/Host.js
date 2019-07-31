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
    <header className="header bg-gray mt-3">
      <div className="row d-block d-md-flex align-items-center">
        <div className="col-12 col-md-1">
          <a href="#" className="logo d-table mx-auto py-xs-1">
            <img src="images/logo.png" />
          </a>
        </div>
        <div className="col col-md-11">
          <h3 className="main-heading">A long title that can come here <span>by host name</span></h3>
          <div className="row justify-content-between align-items-center mt-2">
            <div className="col-12 col-sm-7">
              <div className="time py-xs-1">  <span>04/23/2019, at 12:00 PM</span>
                <span>Time Remaining: 01:10:00</span>
              </div>
            </div>
            <div className="col-12 col-sm-3 justify-content-end d-flex align-items-center">
              <a className="btn btn-primary border-right pr-20" href="javascript:;" tabIndex="1">details</a>
              <button className="cross_btn inner_btn_cross  pr-20 px-4 ml-2" onClick={this.onLogoutClick} tabIndex="1"><i className="fa fa-close"></i></button>
              <img src="images/voice-commands.png" className="mic-icon mr-2" />
            </div>
          </div>
        </div>
      </div>
    </header>
    <section className="bg-gray mt-2 p-3 rounded section attendees">
      <div className="row px-0 px-sm-3 pb-2 pt-0 justify-content-between align-items-center">
        <div className="col-6 col-md-6">
          <h4 className="title">Wine Testers <span>(24/44)</span></h4>
        </div>
        <div className="col-6 col-md-4">
          <button type="button" className="btn btn-outline-secondary float-right">"Show Attendees"</button>
        </div>
      </div>
      
      <div className="row one-gutters" id="subscribers-list"></div>

    </section>
    <div className="row four-gutters">
      <div className="col-12 col-md-12 mt-2 col-lg-4 host-section">
        <div className="bg-gray  px-3 pt-3 pb-2 rounded overflow-hidden h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="main-heading float-left">Streaming</h3>
            <div className="host-header">
              <img src="images/mute-microphone.png" className="unmute-icon" id="mute-unmute-local" />
              <img src="images/music-icon.png" className="music-icon" id="bg-music" />
              <img src="images/video-icon.png" className="video-icon d-none" id="publish" />
              <img src="images/video-close.png" className="video-icon" id="unpublish" />
              <img src="images/circle.png" className="circle-icon mr-0" id="record-stream" />
            </div>
          </div>
          <div id="agora_local" className="video-streams"></div>
        </div>
      </div>
        
      <div className="col-12 col-md-12 mt-2 col-lg-8">
        <div className="bg-gray  p-3 rounded overflow-hidden h-100">
          <div className="d-md-flex justify-content-between align-items-center mb-3">
            <h3 className="main-heading">Testing Script <span className="ml-md-4">1/4 wines</span></h3>
            <div className=" mt-3 mt-md-0 d-md-flex justify-content-between align-items-center">
              <button type="button" className="btn btn-outline-secondary mr-4">"Show Script"</button>
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

      <div className="modal fade" id="hand-raise" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

      <div className="modal-dialog modal-dialog-lg" role="document">

        <div className="modal-content">

        <div className="modal-header">

          <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>

          <button type="button" className="close" data-dismiss="modal" aria-label="Close">

          <span aria-hidden="true">&times;</span>

          </button>

        </div>

        <div className="modal-body" id="active-single-user">

          ...

        </div>

        <div className="modal-footer">

           <button type="button" className="btn btn-primary">Button</button>

        </div>

        </div>

      </div>

      </div>

      <input type="hidden" id="conf-page" />
    
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