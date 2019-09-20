import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, addLogs } from "../../actions/authActions";
import utils from "../../utils/functions";
import $ from 'jquery';
import WineScript from "./WineScript";
import FitnessScript from "./FitnessScript";
import moment from 'moment'

class Host extends Component {

  constructor(props) {
    super(props);
    // this.state = {sessionScript: 0};
    this.state = {
      sessionScript: 0,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      camera:'',
      microphone:''
    };

  }

  addLog = (sessionId, userType, type) => {
    
    this.props.addLogs(sessionId, userType, type);
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  joinOnClick = e => {
    e.preventDefault();
    let channel = document.getElementById('channel').value;
    this.props.joinConf(channel);
  };

  callfunction = e => {
    $('#logout_button').trigger('click');
  }

  sendMsgAll = e => {
    $('#msgToAll_button').trigger('click');
  }
  
  loadScript = function (src) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    
    var body = document.getElementsByTagName('html')[0];
    body.appendChild(tag);
  }

    

  componentDidMount(){
    
    // if any exception if user has no device on streaming page in any case
    let mediaIds = localStorage.getItem('media-setting');

    if(mediaIds == undefined){
      this.props.history.push('pre-screen');
    }


    $('.dropdown.keep-open').on({
      "shown.bs.dropdown": function() { this.closable = false; },
      "click":             function() { this.closable = true; },
      "hide.bs.dropdown":  function() { return this.closable; }
    });
    this.loadScript('/AgoraRTCSDK-2.7.1.js');
    this.loadScript('/agora-rtm-sdk-1.0.0.js');
    this.loadScript('/main.js');
    
    
    // if(localStorage.getItem('load-page') != 1){  
    //     window.loadPopup();
    //   localStorage.setItem("load-page", 1);
    // }

    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    this.setState({sessionScript: localstoragedata.sessionData.id});
    let scDate = localstoragedata.sessionData.scheduleDate;

    // console.log('scDate= ',scDate, new Date(scDate).getTime(), new Date().getTime())

    scDate = (new Date(scDate).getTime()) - (new Date().getTime());
    console.log('scDate- ', scDate)
    // this.state.timerTime = scDate;// 1 sec 1000 = 1sec
    this.setState({timerTime : scDate});
  }
  componentWillMount(){
    this.startTimer();
  }

  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: this.state.timerTime
    });
    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 10;
      if (newTime >= 0) {
        this.setState({
          timerTime: newTime
        });
      } else {
        clearInterval(this.timer);
        this.setState({ timerOn: false });
        $('.countdown-timer').html('Session Started')
        //alert("Countdown ended");
      }
    }, 10);
  };

  testButn =() => {
    window.subscribe()
  };

  // startTimer = () => {
  //   this.setState({
  //     timerOn: true,
  //     timerTime: this.state.timerTime,
  //     timerStart: Date.now() - this.state.timerTime
  //   });
  //   this.timer = setInterval(() => {
  //     this.setState({
  //       timerTime: Date.now() - this.state.timerStart
  //     });
  //   }, 10);
  // };


render() {
    const { timerTime, timerStart, timerOn, sessionScript } = this.state;

    let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor((timerTime / 3600000) % 60)).slice(-2);

    const  {user}  = this.props.auth;

    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    let sessionData = localstoragedata.sessionData;
   
    let localDate = moment(sessionData.scheduleDate).format('MM/DD/YYYY # h:mm a');

    localDate = localDate.replace('#', 'at');
    let remTime = '';
    // console.log('scheduleDate ',localDate );
    // console.log('------------------------------', user);
    let scriptHtml = '';
    // sessionScript = sessionScriptt;
    if (sessionScript == 1) {
      scriptHtml = <WineScript />;
    } else if(sessionScript == 2) {
      scriptHtml = <FitnessScript />;
    }

    var newulength = JSON.parse(localStorage.getItem('tempUsers')).length;
    newulength = newulength < 1 ? 0 : --newulength ;
return (
    <div className="container justify-content-between d-flex flex-column h-100 position-relative">
    <header className="header bg-gray mt-0 position-fixed">
      <div className="row d-block d-md-flex align-items-center">
        <div className="col-12 col-md-1 ">
          <div className="count-box position-relative countdown-logo">
            <div className="countdown">
              <svg>
                <circle r="26" cx="30" cy="30"></circle>
              </svg>
              <a href="#" className="host-logo logo">
                <img src="images/v-logo.png" />
              </a>
            </div>
            
          </div>
          <div className="show-hide-v d-none">
            <div>
              <a href="#" className="back-btn"><i className="fa fa-chevron-left" aria-hidden="true"></i></a>
              <img src="images/v-logo.png" />
            </div>
          </div>
        </div>
        <div className="col col-md-11">
          <h3 className="main-heading show-hide-title d-block">{sessionData.name} <span>by <span className="welcome-title">{sessionData.hostFirstName.toLowerCase()}</span><span className="green-online online-status"><span>ONLINE</span></span></span>
          
          </h3>
          <div className="row justify-content-between align-items-center mt-0">
            <div className="col-12 col-sm-7">
              <div className="time">  <span>{localDate}</span>
                <span className="countdown-timer">Time Remaining: {hours} : {minutes} : {seconds}</span>
                <div id="errmsg" style={{color:'green'}}></div>
                <div id ="all_attendies_list"></div>
              </div>
            </div>
            <div id="guestmsg" className="d-none" style={{color:'green'}}></div>
                       
            <div className="col-12 col-sm-3">
              <div className="col-12 justify-content-end d-flex align-items-center">
                
                <div className="border-right pr-3">
                <a className="btn  btn-primary border-right pr-20" href="#" data-toggle="modal" data-target="#show-details" tabIndex="1">Details</a>
                </div>
                <button className="logout-btn ml-3" onClick={this.callfunction.bind(this)} tabIndex="1">
                  <i className="fa fa-times" aria-hidden="true"></i>
                </button>
                {/*<img src="images/voice-commands.png" className="mic-icon" />*/}
              </div>
            </div>
            <div className="text-danger" style={{color:'#fff'}} id="exptn-errors"></div>
          </div>
        </div>
      </div>
    </header>
    <section className="bg-gray mt-1 px-0 py-1 rounded section attendees">
      <div className="row px-0 px-sm-3 pb-2 pt-1 justify-content-between align-items-center">
        <div className="col-6 col-md-6 d-flex align-items-center">
          <h4 className="title">{sessionData.scriptTitle} (<span id="joined_users">0</span>/<span>{newulength}</span>)</h4>
          <a href="" className="move-list"><img src="images/move-list.png" /></a>
          <a href="" className="move-list"><img src="images/swipe-list.png" /></a>
          <div className="hand-raise-list">
            <div className="dropdown keep-open">
              <button className="dropdown-toggle circle-ripple d-none" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                <img src="images/hand-raise.png" />
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <div className="raised-hands">
                  <h4>Raised Hands (<span id="total-raised-hands">3</span>)</h4>
                  <a href="#"><i className="fa fa-times"></i></a>
                </div>
                <ul className="raised-list" id="raised-list">
                  {/*<li><a className="dropdown-item media" href="#"><img src="images/avtar.png" /> 
                  <div  className="media-body">
                    <span>Amanda P, LA</span>
                    <span>2 min ago</span>
                  </div>
                  </a></li>*/}
                </ul>
                
              </div>
            </div>
          </div>
          
        </div>
        <div className="col-6 col-lg-3 col-md-4 col-sm-5 attendy-fullscreen attendy-fullscreen">
          {/* <button type="button" className="btn btn-outline-secondary float-right mt-1 show-hide-footer-panel mr-3">"Show Attendees"</button> */}
          {/* <a className="fullscreen" href="#" id="fullscreen"><img src="images/full-screen.png" /></a> */}
          <a className="fullscreen" href="#" id="fullscreen"><img src="images/full-screen.png" /></a>
        </div>
      </div>
      
    <div className="row one-gutters justify-content-center align-items-center" id="subscribers-list"></div>

    </section>
    <div className="row position-fixed host-script-section align-items-end justify-content-between">
      <div className=" host-section d-flex flex-direction-column h-100">
        <div className="host-local">
          <div className="add-remove-round1 add-remove-height height-53 px-3 bg-gray pt-2 pb-2 top-rounded d-flex justify-content-between align-items-center">
            <h3 className="main-heading font-size-16 float-left">Streaming</h3>
            <div className="host-header">
              <img src="images/mute-microphone.png" className="unmute-icon" id="mute-unmute-local" />
              <img src="images/music-icon.png" className="music-icon" data-toggle="modal" data-target="#musicList" id="bg-music" />
              <img src="images/video-icon.png" className="video-icon d-none" id="publish" />
              <img src="images/video-close.png" className="video-icon" id="unpublish" />
              <img src="images/circle.png" className="circle-icon mr-0" id="record-stream" />
            </div>
          </div>
          <div className="add-remove-round1 host-show-hide px-3 bg-gray mt--1 pt-2 pb-1 bottom-rounded flex-grow-1">
            <div id="agora_local" className="video-streams"></div>
          </div>
          
        </div>
      </div>

      {scriptHtml}

    </div>
    {/* <!-- Music Player PopUp Start --> */}
      <div className="modal music-list" id="musicList">
        <div className="modal-dialog  rounded">
          <div className="modal-content bg-gray">
            
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            
            <div className="modal-body">
            <ul className="music-playlist">
              <li><a href="#">
                <span>If I Can’t Have You</span>
                <span>Shawn Mendes • If I Can’t Have You</span>
                <span>3:10</span>
              </a></li>
              <li><a href="#">
                <span>If I Can’t Have You</span>
                <span>Shawn Mendes • If I Can’t Have You</span>
                <span>3:10</span>
              </a></li>
              <li><a href="#">
                <span>If I Can’t Have You</span>
                <span>Shawn Mendes • If I Can’t Have You</span>
                <span>3:10</span>
              </a></li>
              <li><a href="#">
                <span>If I Can’t Have You</span>
                <span>Shawn Mendes • If I Can’t Have You</span>
                <span>3:10</span>
              </a></li>
              <li><a href="#">
                <span>If I Can’t Have You</span>
                <span>Shawn Mendes • If I Can’t Have You</span>
                <span>3:10</span>
              </a></li>
              <li><a href="#">
                <span>If I Can’t Have You</span>
                <span>Shawn Mendes • If I Can’t Have You</span>
                <span>3:10</span>
              </a></li>
              <li><a href="#">
                <span>If I Can’t Have You</span>
                <span>Shawn Mendes • If I Can’t Have You</span>
                <span>3:10</span>
              </a></li>
              <li><a href="#">
                <span>If I Can’t Have You</span>
                <span>Shawn Mendes • If I Can’t Have You</span>
                <span>3:10</span>
              </a></li>
            </ul>
            </div>

           
            

          </div>
        </div>
      </div>
      {/* <!-- Music Player PopUp End --> */}
    <div className="modal fade" id="guest-video" role="dialog">
    <div className="modal-dialog modal-lg bg-black px-4 m-0 mw-100 h-100 d-flex w-100 align-items-center">
      <div className="h-100 modal-content bg-transparent w-100 d-flex justify-content-between flex-direction-column">
        <div>
          <button type="button" className="close-model-btn close float-left" data-dismiss="modal">&times;</button>
          <a href="#" className="eject-this">Eject from Session <img src="images/eject.png" /></a>
        </div>
        <div className="modal-content clone-guest-video" id="clone-guest-video"></div>
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
      <div id="show-details" className="modal fade " role="dialog">
      <div className="w-100 d-flex align-items-center bg-black flex-direction-column h-100 mw-100 justify-content-center">
        <div className="modal-content">
        
           <div className="row no-gutters">
            <div className="col-12 col-sm-6">
              
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              </ol>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img className="d-block mx-auto" src="images/product.png" alt="First slide" />
                </div>
                <div className="carousel-item">
                  <img className="d-block mx-auto" src="images/product.png" alt="Second slide" />
                </div>
                <div className="carousel-item">
                  <img className="d-block mx-auto" src="images/product.png" alt="Third slide" />
                </div>
              </div>
              
            </div>
            </div>
            <div className="col-12 col-sm-6 detail-model item-description">
              
              <div className="">
              <button type="button" className="close close-model-btn m-0" data-dismiss="modal">&times;</button>
                <div className="details-content">
                  <h3 className="second-heading my-3">2014 Bliss Block Pinot Noir</h3>
                  <div className="content-scroll">
                    <div className=" row w-100">
                      <ul className="col-12 col-md-12 col-lg-6 list-info">
                        <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                        <li><span>Year</span><span>2014&#8203;</span></li>
                        <li><span>Country</span><span>United States&#8203;</span></li>
                        <li><span>Appellation</span><span>Sonoma</span></li>
                        <li><span>Alcohol</span><span>14.3%</span></li>
                      </ul>
                      <ul className="col-12 col-md-12 col-lg-6 list-info">
                        <li><span>pH</span><span>3.69</span></li>
                        <li><span>Aging</span><span>15 months in French Oak Barrels, 82%</span></li>
                        <li><span>Price</span><span>$80&#8203;</span></li>
                        <li><span>Case Production</span><span>250</span></li>
                      </ul>
                      <div className="col col-md-12">
                        <p className="item-text">The Bliss Block Pinot Noir beautifully captures the rich spice qualities that are characteristic of this cool pocket of our Quail Hill Estate vineyard. A bright garnet hue </p>
                        
                      </div>
                      <div className="col-md-12 mt-3">
                        <strong className="sub-heading">Varietal Composition</strong>
                        <p className="item-text">Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volut.Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metu.</p>
                      </div>
                      <div className="col-md-12 mt-3">
                        <strong className="sub-heading">Varietal Composition</strong>
                        <p className="item-text">Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volut.Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metu.</p>
                      </div>
                      <div className="col-md-12 mt-3">
                        <strong className="sub-heading">Varietal Composition</strong>
                        <p className="item-text">Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volut.Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metu.</p>
                      </div>
                      <div className="col-md-12 mt-3">
                        <strong className="sub-heading">Varietal Composition</strong>
                        <p className="item-text">Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volut.Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metu.</p>
                      </div>
                      <div className="col-md-12 mt-3">
                        <strong className="sub-heading">Varietal Composition</strong>
                        <p className="item-text">Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volut.Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metu.</p>
                      </div>
                      <div className="col-md-12 mt-3">
                        <strong className="sub-heading">Varietal Composition</strong>
                        <p className="item-text">Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volut.Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metu.</p>
                      </div>
                      <div className="col-md-12 mt-3">
                        <strong className="sub-heading">Varietal Composition</strong>
                        <p className="item-text">Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volut.Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metu.</p>
                      </div>
                      <div className="col-md-12 mt-3">
                        <strong className="sub-heading">Varietal Composition</strong>
                        <p className="item-text">Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volut.Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metu.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           </div>
          
        </div>

      </div>
    </div>
      <input type="hidden" id="switch-counter" />
      <input type="hidden" id="selected-participent-id" />
      <input type="hidden" id="to-broadcast" />
      <input type="hidden" id="current-camera" />
      <input type="hidden" id="current-microphone" />
  </div>
    );
  }
}
Host.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  addLogs: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser, addLogs }
)(Host);