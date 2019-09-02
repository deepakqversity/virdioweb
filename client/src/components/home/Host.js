import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import utils from "../../utils/functions";
import $ from 'jquery';
import Config from "./Configuration";
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
      timerTime: 0
    };

  }

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

  sendMsgAll(){
    $('#msgToAll_button').trigger('click');
  }

  componentDidMount(){

  // console.log(2);    //
    if(localStorage.getItem('load-page') != 1){  
        window.loadPopup();
      localStorage.setItem("load-page", 1);
    }
    
    // let sessionId = localStorage.getItem('sessionId');
    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    this.setState({sessionScript: localstoragedata.sessionData.id});
    let scDate = localstoragedata.sessionData.scheduleDate;

    console.log('scDate= ',scDate, new Date(scDate).getTime(), new Date().getTime())

    scDate = (new Date(scDate).getTime()) - (new Date().getTime());
    console.log('scDate- ', scDate)
    this.state.timerTime = scDate;// 1 sec 1000 = 1sec

    // fetch('/api/v1/session/'+sessionId, {headers : {'Authorization': localstoragedata.token}})
    // .then(response => { return response.json(); })
    // .then(data => {
    //   // console.log('data=================', data);
    //   this.setState({sessionScript: data.id});
    //   localStorage.setItem('currentSession', JSON.stringify(data));
        
    // });
  }
  componentWillMount(){
    // const { timerTime, timerOn } = this.state;
    
    this.startTimer();
    //console.log(1);
    // window.test();
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
        //alert("Countdown ended");
      }
    }, 10);
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
    console.log('scheduleDate ',localDate );
    // console.log('------------------------------', user);
    let scriptHtml = '';
    // sessionScript = sessionScriptt;
    if (sessionScript == 1) {
      scriptHtml = <WineScript />;
    } else if(sessionScript == 2) {
      scriptHtml = <FitnessScript />;
    }

return (
    <div className="container justify-content-between d-flex flex-column h-100 position-relative">
    <header className="header bg-gray mt-0 position-fixed">
      <div className="row d-block d-md-flex align-items-center">
        <div className="col-12 col-md-1">
          <a href="#" className="logo d-table mx-auto py-xs-1">
            <img src="images/logo.png" />
          </a>
        </div>
        <div className="col col-md-11">
          <h3 className="main-heading">{sessionData.name} <span>by <span className="welcome-title">{sessionData.hostName.toLowerCase()}</span></span>
          <button className="position-absolute logout-btn" onClick={this.callfunction.bind(this)} tabIndex="1">
                <i className="fa fa-times" aria-hidden="true"></i>
          </button>
          </h3>
          <div className="row justify-content-between align-items-center mt-0">
            <div className="col-12 col-sm-7">
              <div className="time py-xs-1">  <span>{localDate}</span>
                <span>Time Remaining: {hours} : {minutes} : {seconds}</span>
                <div id ="all_attendies_list"></div>
              </div>
            </div>
            <div id="guestmsg" style={{color:'green'}}></div>
                       
            <div className="col-12 col-sm-3">
              <div className="col-12 justify-content-end d-flex align-items-center">
                <a className="btn btn-primary border-right pr-20 mr-1" href="#" tabIndex="0" id="fullscreen">fullscreen</a>
                <a className="btn btn-primary border-right pr-20" href="#" tabIndex="1">details</a>
                <img src="images/voice-commands.png" className="mic-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section className="bg-gray mt-1 px-0 py-1 rounded section attendees">
      <div className="row px-0 px-sm-3 pb-2 pt-0 justify-content-between align-items-center">
        <div className="col-6 col-md-6">
          <h4 className="title">Wine Testers (<span id="joined_users">0</span>/<span>44</span>)</h4>
        </div>
        <div className="col-6 col-md-4">
          <button type="button" className="btn btn-outline-secondary float-right mt-1 show-hide-footer-panel">"Show Attendees"</button>
        </div>
      </div>
      
    <div className="row one-gutters justify-content-center align-items-center" id="subscribers-list"></div>

    </section>
    <div className="row position-fixed host-script-section justify-content-between">
      <div className=" host-section d-flex flex-direction-column h-100">
        <div className="host-local">
          <div className="add-remove-round add-remove-height height-53 px-3 bg-gray pt-2 pb-2 top-rounded d-flex justify-content-between align-items-center">
            <h3 className="main-heading font-size-16 float-left">Streaming</h3>
            <div className="host-header">
              <img src="images/mute-microphone.png" className="unmute-icon" id="mute-unmute-local" />
              <img src="images/music-icon.png" className="music-icon" id="bg-music" />
              <img src="images/video-icon.png" className="video-icon d-none" id="publish" />
              <img src="images/video-close.png" className="video-icon" id="unpublish" />
              <img src="images/circle.png" className="circle-icon mr-0" id="record-stream" />
            </div>
          </div>
          <div className="add-remove-round host-show-hide px-3 bg-gray mt--1 pt-2 pb-1 bottom-rounded">
            <div id="agora_local" className="video-streams"></div>
          </div>
          
        </div>
      </div>

      {scriptHtml}

    </div>
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

      <input type="hidden" id="conf-page" />
      <Config />
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