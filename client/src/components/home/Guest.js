import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, addLogs } from "../../actions/authActions";
import $ from 'jquery';
import LeftScriptParticipant from "./LeftScriptParticipant";
import FooterScriptParticipant from "./FooterScriptParticipant";
import WineScript from "./WineScript";
import FitnessScript from "./FitnessScript";
import moment from 'moment'

class Guest extends Component {

  constructor(props) {
    super(props);
    //this.state = {getID : ''}

    this.state = {
      getID : '',
      getEmail : '',
      sessionScript: 0,
      timerOn: false,
      timerStart: 0,
      timerTime: 0
    };

  }

  addLog = (sessionId, userType, type) => {
    
    this.props.addLogs(sessionId, userType, type);
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
    
  };
  

  // joinOnClick = e => {
  //   e.preventDefault();
  //   let channel = document.getElementById('channel').value;
  //   this.props.joinConf(channel);
  // };

  callfunction(){
    $('#logout_button').trigger('click');
  }
  

  handRaise(){
    // var ID=this.state.getID;
    // console.log(ID);
    $('#handRaiseClient_button').trigger('click');
  }


  loadScript = function (src) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    
    var body = document.getElementsByTagName('html')[0];
    body.appendChild(tag);
  }

  componentDidMount(){
    
    
    this.loadScript('/AgoraRTCSDK-2.7.1.js');
    this.loadScript('/agora-rtm-sdk-1.0.0.js');
    this.loadScript('/main.js');

    // if(localStorage.getItem('load-page') != 1){  
    //     window.loadPopup();
    //   localStorage.setItem("load-page", 1);
    // }
    
    let localstoragedata = JSON.parse(localStorage.getItem('userData'));

    this.setState({getID : localstoragedata.id});
    this.setState({getEmail : localstoragedata.email});

   // let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    this.setState({sessionScript: localstoragedata.sessionData.id});
    let scDate = localstoragedata.sessionData.scheduleDate;

    // console.log('scDate= ',scDate, new Date(scDate).getTime(), new Date().getTime())

    scDate = (new Date(scDate).getTime()) - (new Date().getTime());
    // console.log('scDate- ', scDate)
    this.state.timerTime = scDate;// 1 sec 1000 = 1sec

    
  }
  
  componentWillMount(){
    // if any exception if user has no device on streaming page in any case
    let mediaIds = localStorage.getItem('media-setting');

    if(mediaIds == undefined){
      this.props.history.push('pre-screen');
    }
    //console.log(1);
    // window.test();
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
        // window.sessionTimer();
        //alert("Countdown ended");
      }
    }, 10);
  };

render() {


  
  //const  {user}  = this.props.auth;

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
    let newulength = JSON.parse(localStorage.getItem('tempUsers')).length;
    newulength = newulength < 1 ? 0 : --newulength ;

return (
    <div className="container d-flex flex-column justify-content-between h-100 overlay position-relative">

      <div id="agora_host" className="fix-host"></div>
      
  <header className="header w-100 p-0">
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="transparent-gray guest-screen">
            <div className="row">
              <a href="" className="col-12 py-xs-1 col-lg-1 col-md-1 col-sm-12 d-flex v-logo align-items-center">
                <img src="images/v-logo.png" />
              </a>
              <div className="col-12 col-lg-11 col-md-11 col-sm-12">
              <h3 className="main-heading show-hide-title d-block">{sessionData.name} <span>by <span className="welcome-title">{sessionData.hostFirstName.toLowerCase()}</span><span className="green-online online-status"><span>ONLINE</span></span></span>
          
          </h3>
                <div className="row justify-content-between align-items-center">
                  <div className="col-12 col-lg-7 col-md-6 text-center text-md-left col-sm-12">
                    <div className="time py-xs-1">  <span>{localDate}</span>
                    <span className="countdown-timer">Time Remaining: {hours} : {minutes} : {seconds}</span>
                    </div>
                    <div id="hostmsg" style={{color:'green'}}></div>
                  </div>
                  
                  <div className="col-12 center-mob col-sm-12 col-md-6 col-lg-3 d-flex justify-content-end">
                  
                    <a className="col-2 justify-content-end d-flex align-items-center" href="#" className="btn btn-primary " tabIndex="1">Details</a>
                    <div className="default-btns mr-2">
                      <a href="#" className="btn btn-primary ml-2" id="mocrophone-off" onClick={this.handRaise.bind(this)} alt="Microphone" title="Microphone Off"><img src="images/hand.png" /></a>
                      <a href="#" className="btn btn-primary ml-2 d-none" id="mocrophone-on" alt="Microphone" title="Microphone On"><i className="fa fa-microphone"></i></a>
                    </div>

                      {/*<a className="col-2 justify-content-end d-flex align-items-center" href="#" className="btn btn-primary " tabIndex="1">Details</a>
                        <a href="#" className="btn btn-primary ml-2" id="strm-publish" alt="Broadcaster" title="Broadcaster"><i className="fa fa-user-plus"></i></a>
                         <a href="#" className="btn btn-primary ml-2 d-none" id="strm-unpublish" alt="Audience" title="Audience"><i className="fa fa-user-times"></i></a>*/}

                      {/* <button className="btn btn-primary ml-2" onClick={this.onLogoutClick} tabIndex="1"><i className="fa fa-power-off"></i></button> */}
                      <button className="ml-2 logout-btn" onClick={this.callfunction.bind(this)} tabIndex="1">
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>
                  </div>
                  <div className="text-danger" style={{color:'#fff'}} id="exptn-errors"></div>
                </div>
              </div>
            </div>
          </div>
                  
        </div>
        
      </div>
      
    </header>
    
    <div className="d-flex justify-content-between zindex-5 position-relative flex-grow-1 attend-mid-section">
    
    <LeftScriptParticipant sessId={sessionData.id} />
    
    <div className="col-lg-3 col-md-4 col-sm-5 col-6 max-width-300 float-right pl-0 mt-4">
        <div className="right-sidebar">
          <div className="transparent-gray slide-right-left" style={toggleList}>
            
            <div className="joined-attendees ">
              <h4 className="mb-2 head"><span className="title">Wine Testers</span><span className="count">(<span  id="joined_users_at_client">0</span>/<span>{newulength}</span>)</span></h4>
              <div className="joined-member-list" id="all_joined_member_list"></div>
              <button type="button" id="minimize-others" className="mt-2 minimize-others mx-auto d-none"><img src="images/exit-screen.png" /></button>

            </div>
            <button type="button" id="show-everyone" className="show-others mx-auto"></button>
          
          
          </div>
          
          
        </div>
      
    </div>
  </div>
    <footer className="footer position-relative zindex-5 count-box mb-5 mt-4">
      
      <FooterScriptParticipant sessId={sessionData.id} />

      <div className="self-video1 mt-3 w-50">
          
          <div id="agora_local" className="video-streams guest-video" style={videoAspect}></div>
          
      </div>
    </footer>
    
  
    
    <div id="show-details" className="modal fade " role="dialog">
      <div className="w-100 d-flex align-items-center bg-dark flex-direction-column h-100 mw-100 justify-content-center">
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

  </div>
    );
  }
}
const toggleList = {
  width: '72px',
  float: 'right'
}
const videoAspect = {
  width: "235px",
  height: "132px",
  float: "right",
  "margin-right": "5px"
}
Guest.propTypes = {
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
)(Guest);