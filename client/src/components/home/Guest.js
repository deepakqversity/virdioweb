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
      timerTime: 0,
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


  // showpart = e => {
  //   $('#newhtt').trigger('click');
  // }


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

    let currDate = new Date();
    currDate.setMinutes(currDate.getMinutes() + 330); // adding 330 minutes for matching IST time
    scDate = (new Date(scDate).getTime()) - (new Date(currDate).getTime());
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

  
  sessionTimer = () => {
    
    let storeData = JSON.parse(localStorage.getItem('userData'));
    
    
    let countdown = storeData.sessionData.duration * 60;
    console.log("cn------------"+countdown);
    //console.log('attribute '+ $('.header svg circle').attr("style"));
    $('.header svg circle').attr("style","animation-duration:"+countdown+"s !important");
    console.log('attribute '+$('.header svg circle').attr("style"));
    $('.header svg circle').css("stroke", "#9b51e0");
    console.log('countdown ======= countdown start ----', countdown)
    
    
    var resetCount1 = setInterval(function() {
      if(countdown <= 0){
        console.log('=========== **********', countdown)
        $('.header svg circle').removeAttr("style");
        clearInterval(resetCount1);
      }
      countdown--;
    }, 1000);
  };

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
        $('.countdown-timer').html('Session Started');
        // console.log("Countdown ended");
        this.sessionTimer();
      }
    }, 10);
  };

render() {

  //const  {user}  = this.props.auth;

    const { timerTime, timerStart, timerOn, sessionScript } = this.state;

    let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);
    //let hours = ("0" + Math.floor((timerTime / 3600000))).slice(-2);
    let hours = Math.floor((timerTime / 3600000));

    if(hours >= 100) {
      hours = ("0" + hours).slice(-3);
    } else {
      hours = ("0" + hours).slice(-2);
    }

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
    console.log('newulength-------------', newulength);
    newulength = newulength < 1 ? 0 : --newulength ;

return (
    <div className="container d-flex flex-column justify-content-between h-100 overlay position-relative">

      <div id="agora_host" className="fix-host"></div>
      
  <header className="header w-100 p-0">
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="transparent-gray guest-screen">
            <div className="row">
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
              <div className="col-12 col-lg-11 col-md-11 col-sm-12 pl-4">
              <h3 className="main-heading show-hide-title d-block">{sessionData.name} <span>by <span className="welcome-title trim-text">{sessionData.hostFirstName.toLowerCase()} {sessionData.hostLastName.toLowerCase()}</span><span className="green-online online-status"><span>ONLINE</span></span></span>
          
          </h3>
                <div className="row justify-content-between align-items-center">
                  <div className="col-12 col-lg-9 col-md-6 text-center text-md-left col-sm-12">
                    <div className="time py-xs-1">  <span>{localDate}</span>
                    <span className="countdown-timer">Time Remaining: {hours} : {minutes} : {seconds}</span>
                    </div>
                    <div id="hostmsg" className="d-none" style={{color:'green'}}></div>
                  </div>
                  
                  <div className="col-12 center-mob col-sm-12 col-md-6 col-lg-3 d-flex justify-content-end">
                    
                    <a className="col-2 justify-content-end d-flex align-items-center" href="javascript:;" className="btn btn-primary mr-2" tabIndex="1" id="mute-unmute"><i className="fa fa-volume-up"></i></a>
                    
                    {(
                        ()=>{
                            if(sessionData.interestId == 1) {
                                return <a className="col-2 justify-content-end d-flex align-items-center" href="#" data-toggle="modal" data-target="#show-details4" className="btn btn-primary" tabIndex="1">Details</a>;
                            } else {                      
                                return <a className="btn  btn-primary border-right pr-20" href="#!" data-toggle="modal" data-target="#fitness-script" tabIndex="1">Details</a>;             
                            }
                        }
                    )()}

                    {/* <a className="col-2 justify-content-end d-flex align-items-center" href="#" data-toggle="modal" data-target="#show-details" className="btn btn-primary "  onClick={this.showpart.bind(this)}  tabIndex="1">Details</a> */}
                    {/* <a className="col-2 justify-content-end d-flex align-items-center" href="#" className="btn btn-primary "   tabIndex="1">Details</a> */}
                    <div className="default-btns">
                      <a href="#" className="btn btn-primary ml-2" id="mocrophone-off" onClick={this.handRaise.bind(this)} alt="Microphone" title="Microphone Off"><img src="images/hand.png" /></a>
                      <a href="#" className="btn btn-primary ml-2 d-none" id="mocrophone-on" alt="Microphone" title="Microphone On"><i className="fa fa-microphone"></i></a>
                    </div>

                      {/*<a className="col-2 justify-content-end d-flex align-items-center" href="#" className="btn btn-primary " tabIndex="1">Details</a>
                        <a href="#" className="btn btn-primary ml-2" id="strm-publish" alt="Broadcaster" title="Broadcaster"><i className="fa fa-user-plus"></i></a>
                         <a href="#" className="btn btn-primary ml-2 d-none" id="strm-unpublish" alt="Audience" title="Audience"><i className="fa fa-user-times"></i></a>*/}

                      {/* <button className="btn btn-primary ml-2" onClick={this.onLogoutClick} tabIndex="1"><i className="fa fa-power-off"></i></button> */}
                      
                      {(
                        ()=>{
                            if(localstoragedata.userType == 2 && sessionData.interestId == 1) {
                              return <button className="ml-2 logout-btn" data-toggle="modal" data-target="#cart-details"><i className="fa fa-times" aria-hidden="true"></i></button>;
                            } else {                          
                              return <button className="ml-2 logout-btn" onClick={this.callfunction.bind(this)} tabIndex="1"><i className="fa fa-times" aria-hidden="true"></i></button>;
                            }
                        }
                      )()}

                      {/*<button className="ml-2 logout-btn" onClick={this.callfunction.bind(this)} tabIndex="1">
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>*/}

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
    
    <LeftScriptParticipant interestId={sessionData.interestId} />
    
    <div className="col-lg-3 col-md-4 col-sm-5 col-6 max-width-300 float-right pl-0 mt-4">
        <div className="right-sidebar">
          <div className="transparent-gray slide-right-left" style={toggleList}>
            
            <div className="joined-attendees ">
              <h4 className="mb-2 head"><span className="title">Wine Testers</span><span className="count">(<span  id="joined_users_at_client">0</span>/<span>{newulength}</span>)</span></h4>
              <div className="joined-member-list" id="all_joined_member_list"></div>
              <button type="button" id="minimize-others" className="mt-2 minimize-others mx-auto d-none"></button>

            </div>
            <button type="button" id="show-everyone" className="show-others mx-auto"></button>
          
          
          </div>
          
          
        </div>
      
    </div>
  </div>
    <footer className="footer position-relative zindex-5 count-box mb-5 mb-lg-2 mt-4">
      
      <FooterScriptParticipant interestId={sessionData.interestId} />

      <div className="self-video1 mt-3 w-50">
          
          <div id="agora_local" className="video-streams guest-video" style={videoAspect}></div>
          
      </div>
    </footer>
    
  
    
    <div id="show-details4" className="show-details modal fade " role="dialog">
    <div className="modal-dialog w-100 d-flex align-items-center bg-black flex-direction-column h-100 mw-100 justify-content-center ">
        <div className="modal-content">
          
          <div className="modal-header">
            <button type="button" className="close close-model-btn m-0" data-dismiss="modal">&times;</button>
          </div>

           <div className="row no-gutters">
            <div className="col-12 col-sm-12">
              
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                {
                  sessionData.scriptDetail.map((opt, i) =>
                    <li data-target="#carouselExampleIndicators" data-slide-to={i} className={i==0 ? "active" : ""} key={i}></li>
                )}
              </ol>
              <div className="carousel-inner">


                {
                  sessionData.scriptDetail.map((opt, i) =>
                    <div className={i==0 ? 'carousel-item active' : 'carousel-item'} key={i}>
                    <div className="d-flex">
                      <div className="col-12 col-sm-6 d-flex align-items-center">
                        <img className="mx-auto d-block mw-75" src={ opt.image != '' ? 'images/'+opt.image : 'images/product.png'} />
                      </div>
                      
                      <div className="col-12 col-sm-6 detail-model item-description">
                      <div className="">
                      
                        <div className="details-content">
                          <h3 className="second-heading my-3">{opt.name}</h3>
                          <div className="content-scroll">
                            <div className=" row w-100">
                              <ul className="col-12 col-md-12 col-lg-6 list-info">

                                {
                                  opt.attribute.map((opt1, j) =>
                                    <li key={j}><span>{opt1.attrLabel}</span><span>{opt1.attrValue}</span></li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
               )}
                
                
              </div>
              
            </div>
            </div>
            
           </div>
          
        </div>

      </div>
    </div>

    <div className="modal attendy-list fitness-script1" id="fitness-script">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Fitness Script</h4>
              <button type="button" className="close " data-dismiss="modal">×</button>
            </div>
            <div className="modal-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="text-left">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Duration type</th>
                  <th scope="col">Counts (Reps/Secs)</th>
                  <th scope="col">Target Zone</th>
                  <th scope="col">Target BPM</th>
                  <th scope="col">Video</th>
                </tr>
              </thead>
              <tbody>

                {
                  sessionData.scriptDetail.map((opt, i) =>
                    <tr key={i}>
                      <td>{opt.name}</td>

                        {
                           this.type = '', 
                           this.duration = '',
                           this.counts = '',
                           this.targetBPM = '',
                           this.targetZone = '',
                           this.video = ''
                        }

                        {
                          opt.attribute.map((opt1, j) =>

                            {(
                                ()=>{
                                    if(opt1.attrLabel.toLowerCase() == 'activity type') {
                                        this.type = opt1.attrValue
                                    } else if(opt1.attrLabel.toLowerCase() == 'duration') {                      
                                        this.duration = opt1.attrValue           
                                    } else if(opt1.attrLabel.toLowerCase() == 'counter') {                      
                                        this.counts = opt1.attrValue           
                                    } else if(opt1.attrLabel.toLowerCase() == 'target zone' && sessionData.zoneTracking == 1) {                      
                                        this.targetZone = opt1.attrValue           
                                    } else if(opt1.attrLabel.toLowerCase() === 'target bpm' && sessionData.heartRateMonitor == 1) {                      
                                        this.targetBPM = opt1.attrValue           
                                    } else if(opt1.attrLabel.toLowerCase() == 'video') {                      
                                        this.video = opt1.attrValue           
                                    }
                                }
                            )()}
                        )}
                      
                        <td>{this.type}</td>
                        <td>{this.duration}</td>
                        <td>{this.counts}</td>
                        <td>{this.targetZone}</td>
                        <td>{this.targetBPM}</td>
                        <td>{this.video}</td>
                    </tr>
                )}

              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>


      <div className="modal" id="cart-details">

          
          <div class="modal-content winesbg">
      
              <div class="modal-header violetborder">
                <h4 class="modal-title white">Order Wines that were tasted</h4>
                {/*<button type="button" class="close white closepopup" data-dismiss="modal">&times;</button>*/}
                <button type="button" class="close white closepopup" data-dismiss="modal">&times;</button>
              </div>
              
              <div class="modal-body">
               <div class="card winesbg">
                  
                  <div class="container">

                    <div class="row">

                        <div class="col-md-6">
                          <h1 class="border-bot">Wine</h1>
                          <h2>Purcari 2007</h2>
                          <div class="row border-bot pb-3">
                            <div class="col-md-4">
                              <p>Appearence</p>
                              <span><img class="aroma-icon" src="images/appearance-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/appearance-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/appearance-3.png" alt="" /></span>
                            </div>
                            <div class="col-md-8">
                              <p>Aroma</p>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                            </div>
                          </div>

                          <h2>Poinot Noir 2005</h2>
                          <div class="row border-bot pb-3">
                            <div class="col-md-4">
                              <p>Appearence</p>
                              <span><img class="aroma-icon" src="images/appearance-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/appearance-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/appearance-3.png" alt="" /></span>
                            </div>
                            <div class="col-md-8">
                              <p>Aroma</p>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                            </div>
                          </div>
                          <h2>Napa Valley's Finest</h2>
                          <div class="row border-bot pb-3">
                            <div class="col-md-4">
                              <p>Appearence</p>
                              <span><img class="aroma-icon" src="images/appearance-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/appearance-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/appearance-3.png" alt="" /></span>
                            </div>
                            <div class="col-md-8">
                              <p>Aroma</p>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                            </div>
                          </div>
                          <h2>Lacrima Lui Ovidiu 2001</h2>
                          <div class="row border-bot pb-3">
                            <div class="col-md-4">
                              <p>Appearence</p>
                              <span><img class="aroma-icon" src="images/appearance-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/appearance-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/appearance-3.png" alt="" /></span>
                            </div>
                            <div class="col-md-8">
                              <p>Aroma</p>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                            </div>
                          </div>
                        </div>

                      <div class="col-md-3">
                          <h1 class="border-bot">Price</h1>
                          <h1>$40</h1>
                          <div class="row border-bot pb-3">
                            <div class="col-md-12">
                              <p>Palate</p>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                            </div>
                          </div>
                          <h1>$40</h1>
                          <div class="row border-bot pb-3">
                            <div class="col-md-12">
                              <p>Palate</p>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                            </div>
                          </div>
                          <h1>$40</h1>
                          <div class="row border-bot pb-3">
                            <div class="col-md-12">
                              <p>Palate</p>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                            </div>
                          </div>
                          <h1>$77</h1>
                          <div class="row border-bot pb-3">
                            <div class="col-md-12">
                              <p>Palate</p>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-3.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-4.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-1.png" alt="" /></span>
                              <span><img class="aroma-icon" src="images/aroma-2.png" alt="" /></span>
                            </div>
                          </div>
                      </div>

                      <div class="col-md-2">
                          <h1 class="border-bot">Enter Quantity</h1>
                          <div class="row border-bot pb-3">
                            <div class="col-md-12">
                              <div class="quantity">                  
                                <div><a href="#"><img src="images/add.png" class="mr-2" /></a></div>
                                <div class="quantity-digit">0</div>    
                                <div><a href="#"><img src="images/minus.png" class="mr-2" /></a></div>
                              </div>
                              <div class="ml-5">
                                <p>Score</p>
                                <span><img class="aroma-icon" src="images/score.png" alt="" /></span>
                              </div>
                            </div>
                          </div>
                          <div class="row border-bot pb-3">
                            <div class="col-md-12">
                              <div class="quantity">                  
                                <div><a href="#"><img src="images/add.png" class="mr-2" /></a></div>
                                <div class="quantity-digit">0</div>    
                                <div><a href="#"><img src="images/minus.png" class="mr-2" /></a></div>
                              </div>
                              <div class="ml-5">
                                <p>Score</p>
                                <span><img class="aroma-icon" src="images/score.png" alt="" /></span>
                              </div>
                            </div>
                          </div>
                          <div class="row border-bot pb-3">
                            <div class="col-md-12">
                              <div class="quantity">                  
                                <div><a href="#"><img src="images/add.png" class="mr-2" /></a></div>
                                <div class="quantity-digit">0</div>    
                                <div><a href="#"><img src="images/minus.png" class="mr-2" /></a></div>
                              </div>
                              <div class="ml-5">
                                <p>Score</p>
                                <span><img class="aroma-icon" src="images/score.png" alt="" /></span>
                              </div>
                            </div>
                          </div>
                          <div class="row border-bot pb-3">
                            <div class="col-md-12">
                              <div class="quantity">                  
                                <div><a href="#"><img src="images/add.png" class="mr-2" /></a></div>
                                <div class="quantity-digit">6</div>    
                                <div><a href="#"><img src="images/minus.png" class="mr-2" /></a></div>
                              </div>
                              <div class="ml-5">
                                <p>Score</p>
                                <span><img class="aroma-icon" src="images/score-2.png" alt="" /></span>
                              </div>
                            </div>
                          </div>

                        </div>

                      <div class="col-md-1">
                          <h1 class="border-bot">Total</h1>
                          <div class="row border-total">
                            <div class="col-md-12">
                              <h1>$0</h1>
                            </div>
                          </div>
                          <div class="row border-total pt-4">
                            <div class="col-md-12">
                              <h1>$0</h1>
                            </div>
                          </div>
                          <div class="row border-total pt-4">
                            <div class="col-md-12">
                              <h1>$0</h1>
                            </div>
                          </div>
                          <div class="row border-total pt-4">
                            <div class="col-md-12">
                              <h1>$462</h1>
                            </div>
                          </div>
                        </div>
            
                        <div class="col-md-11"></div>                                          
                        <div class="col-md-1">
                          <p>Total</p>
                          <div class="totalText">$462</div>
                        </div>
                    </div>                    
                  </div>
              </div>                     
            </div>
          <div class="order-bt">
            <a href="#!" class="save-btn btn btn-primary my-5 mx-auto" onClick={this.callfunction.bind(this)}>Submit Order</a>
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
  marginRight: "5px"
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