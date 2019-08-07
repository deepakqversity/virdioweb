import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import $ from 'jquery';
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

  callfunction(){
    $('#logout_button').trigger('click');
  }
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
    <div className="container justify-content-between d-flex flex-column h-100 position-relative">
    <header className="header bg-gray mt-2 position-fixed">
      <div className="row d-block d-md-flex align-items-center">
        <div className="col-12 col-md-1">
          <a href="#" className="logo d-table mx-auto py-xs-1">
            <img src="images/logo.png" />
          </a>
        </div>
        <div className="col col-md-11">
          <h3 className="main-heading">A long title that can come here <span>by host name</span>
          <button className="position-absolute logout-btn" onClick={this.callfunction.bind(this)} tabIndex="1">
                <i className="fa fa-times" aria-hidden="true"></i>
          </button>
          </h3>
          <div className="row justify-content-between align-items-center mt-2">
            <div className="col-12 col-sm-7">
              <div className="time py-xs-1">  <span>04/23/2019, at 12:00 PM</span>
                <span>Time Remaining: 01:10:00</span>
              </div>
            </div>
            <div className="col-12 col-sm-3">
              <div className="col-12 justify-content-end d-flex align-items-center">
                <a className="btn btn-primary border-right pr-20" href="javascript:;" tabIndex="1">details</a>
                <img src="images/voice-commands.png" className="mic-icon" />
              </div>
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
      
    <div className="row one-gutters align-items-center" id="subscribers-list"></div>

    </section>
    <div className="row four-gutters position-fixed host-script-section">
      <div className="col-12 col-md-12 mt-2 col-lg-3 host-section">
        <div className="bg-gray px-3 pt-2 pb-1 rounded overflow-hidden h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="main-heading font-size-16 float-left">Streaming</h3>
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
        
      <div className="col-12 col-md-12 mt-2 col-lg-9">
        <div className="bg-gray px-3 py-2 rounded overflow-hidden h-100">
          <div className="d-md-flex justify-content-between align-items-center mb-2">
            <h3 className="main-heading font-size-16">Testing Script <span className="ml-md-4 font-size-16">1/4 wines</span></h3>
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
    <div className="modal fade" id="guest-video" role="dialog">
    <div className="modal-dialog modal-lg bg-black px-4 m-0 mw-100 h-100 d-flex w-100 align-items-center">
      <div className="h-100 modal-content bg-transparent w-100 d-flex justify-content-between flex-direction-column">
        <div>
          <button type="button" className="close-model-btn close float-left" data-dismiss="modal">&times;</button>
          <a href="#" className="eject-this">Eject from Session <img src="images/eject.png" /></a>
        </div>
        <div className="modal-content clone-guest-video"></div>
        <div className="guest-video-footer">
          <div className="conversations">
            <a href="#"><img src="images/private-conversation.png" />Public Conversation</a>
            <a href="#"><img src="images/private-conversation.png" />Private Conversation</a>
            <a href="#" className="float-right mr-0">Emotions <img className="ml-3" src="images/quote-circular-button.png" /></a>
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