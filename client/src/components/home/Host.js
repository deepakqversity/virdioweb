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
      microphone:'',
      type : '',
      duration : '',
      counts : '',
      targetZone : '',
      targetBPM : '',
      video : ''
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

    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    this.setState({sessionScript: localstoragedata.sessionData.interestId});
    let scDate = localstoragedata.sessionData.scheduleDate;

    // console.log('scDate= ',scDate, new Date(scDate).getTime(), new Date().getTime())

    /*let currDate = new Date();
    currDate.setMinutes(currDate.getMinutes() + 330); // adding 330 minutes for matching IST time
    scDate = (new Date(scDate).getTime()) - (new Date(currDate).getTime());*/

    let currDate = new Date(scDate);
    currDate.setMinutes(currDate.getMinutes() + localstoragedata.sessionData.duration); // adding 330 minutes for matching IST time
    scDate = (new Date(currDate).getTime()) - (new Date().getTime());

    // scDate = (new Date(scDate).getTime()) - (new Date().getTime());
    console.log('scDate- ', scDate)
    this.state.timerTime = scDate;// 1 sec 1000 = 1sec
    // this.setState({timerTime : scDate});

    this.startTimer();
    this.sessionTimer();
  }
  componentWillMount(){
    this.startTimer();
    this.sessionTimer();
  }
  sessionTimer = () => {
    
    let storeData = JSON.parse(localStorage.getItem('userData'));
    
    //console.log('---------lalitstoreData---------',storeData)
    
    let countdown = storeData.sessionData.duration * 60;
    //console.log('---------lalitcountdown---------',countdown)
    // let countdown = 60;
    $('.header svg circle').attr("style","animation-duration:"+countdown+"s !important");
    $('.header svg circle').css("stroke", "#9b51e0");

    //console.log('countdown ======= countdown start ----', countdown)
    
    var resetCount1 = setInterval(function() {
      if(countdown <= 0){
        //console.log('=========== **********', countdown)
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
      //console.log('------startnewTime11111------',this.state.timerTime)
      const newTime = this.state.timerTime - 10;
      //console.log('------startnewTime------',newTime)
      if (newTime >= 0) {
        this.setState({
          timerTime: newTime
        });
      } else {
        //console.log('------this.timer------',this.timer)
        clearInterval(this.timer);
        this.setState({ timerOn: false });
        $('.countdown-timer').html('Session Ended');

        this.sessionTimer();
      }
    }, 10);
  };

  testButn =() => {
    window.subscribe()
  };

render() {
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
   
    /*let scheduledDate = new Date(sessionData.scheduleDate);
    scheduledDate.setMinutes(scheduledDate.getMinutes() - 330);
    let localDate = moment(scheduledDate).format('MM/DD/YYYY # h:mm a');*/

    let localDate = moment(sessionData.scheduleDate).format('MM/DD/YYYY # h:mm a');
    localDate = localDate.replace('#', 'at');
    let remTime = '';
    let total_limit= localstoragedata.default.maxUserLimit;
    //console.log('--------total_limit------------',total_limit)
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

    let onlineUsers = '';
    let participent = '';
    let participentTimerPopup = '';

    let tempUsersdata = JSON.parse(localStorage.getItem('tempUsers'));

    onlineUsers = tempUsersdata.map((user, idx) => {
      if(user.userType != 1) {
        const { id, firstName, lastName, image, city } = user;
        return (
          <tr data-position="100000000000000" id={"online-user-row-"+id} key={idx}>
          <th scope="row"><img src={image} /></th>
          <td className="text-left"><span className="welcome-title">{firstName.toLowerCase()} {lastName != null ? lastName.toLowerCase() : ''} {city != null ? ', '+city.toLowerCase() : ''}</span></td>
          <td><img className="mr-2 user-status" src="/images/offline.png" /><span className="user-online-status">offline</span></td>
          <td className="visible-status"><i className="fa fa-check text-green d-none" id={"user-green-status-"+id}></i><i className="fa fa-times text-red" id={"user-red-status-"+id}></i></td>
          <td>5</td>
          </tr>
        );
      }
    })
return (
    <div className="container justify-content-between d-flex flex-column h-100 position-relative">
    <header className="header bg-gray mt-0 position-fixed">
      <div className="row d-block d-md-flex align-items-center">
        <div className="col-12 col-md-1 ">
          <div className="count-box position-relative countdown-logo">
            <div className="countdown">
              <svg>
                <circle r="30" cx="33" cy="33"></circle>
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
          <h3 className="main-heading show-hide-title d-block">{sessionData.name} <span>by <span className="welcome-title">{sessionData.hostFirstName.toLowerCase()} {sessionData.hostLastName.toLowerCase()}</span><span className="green-online online-status"><span>ONLINE</span></span></span>
          
          </h3>
          <div className="row justify-content-between align-items-center mt-0">
            <div className="col-12 col-sm-7">
              <div className="time">  <span>{localDate}</span>
                <span className="countdown-timer">Time Remaining: {hours} : {minutes} : {seconds}</span>
                <div id="errmsg"  className="d-none" style={{color:'green'}}></div>
                <div id ="all_attendies_list"></div>
              </div>
            </div>
            <div id="guestmsg" className="d-none" style={{color:'green'}}></div>
                       
            <div className="col-12 col-sm-3">
              <div className="col-12 justify-content-end d-flex align-items-center translatee">
                
                <div className="border-right pr-3">

                {(
                    ()=>{
                        if(sessionData.interestId == 1) {
                            return <a className="btn  btn-primary border-right pr-20" href="#" data-toggle="modal" data-target="#show-details2" tabIndex="1">Details</a>;
                        } else {                      
                            return <a className="btn  btn-primary border-right pr-20" href="#" data-toggle="modal" data-target="#fitness-ssession-details" tabIndex="1">Details</a>;             
                        }
                    }
                )()}

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
    <section className="bg-gray px-0 py-1 rounded section attendees mysec" id="">
      <div className="row px-0 px-sm-3 pb-2 pt-1 justify-content-between align-items-center">
        <div className="col-6 col-md-6 d-flex align-items-center">
          {/*<h4 className="title">Participant View (<span id="joined_users">0</span>/<span>{localstoragedata.default.maxUserLimit}</span>)</h4>*/}
          <h4 className="title">Participant View (<span id="joined_users">0</span>/<span id="online-users">0{/*newulength*/}</span>)</h4>
          <a href="" className="move-list"  id="partlist"  data-toggle="modal" data-target="#attendy-list" className="open-list"><img src="images/move-list.png" /></a>
          <a href="" className="move-list"><img src="images/swipe-list.png" /></a>
          <div className="hand-raise-list">
            <div className="dropdown">
              <button className="dropdown-toggle circle-ripple d-none" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                <img src="images/hand-raise.png" />
              </button>
              <div className="dropdown-menu d-none" id="dropdownmenuitem11" aria-labelledby="dropdownMenuButton">
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
      
    <div className="row one-gutters justify-content-center align-items-center subsc" id="subscribers-list"></div>

    </section>
    <div className="row position-fixed host-script-section align-items-end justify-content-between">
      <div className=" host-section d-flex flex-direction-column h-100">
        <div className="host-local">
          {/* <div className="add-remove-round1 add-remove-height height-53 px-3 bg-gray pt-2 pb-2 top-rounded d-flex justify-content-between align-items-center">
            <h3 className="main-heading font-size-16 float-left">Streaming</h3>
            <div className="host-header">
              <img src="images/mute-microphone.png" className="unmute-icon" id="mute-unmute-local" />
              <img src="images/music-icon.png" className="music-icon" data-toggle="modal" data-target="#musicList" id="bg-music" />
              <img src="images/video-icon.png" className="video-icon d-none" id="publish" />
              <img src="images/video-close.png" className="video-icon d-none" id="unpublish" />
              <img src="images/reverse-cam.png" className="video-icon" id="switch-camera" />
              <img src="images/circle.png" className="circle-icon mr-0" id="record-stream" />
            </div>
          </div> */}
          <div className="add-remove-round1 host-show-hide px-3 bg-gray mt--1 pt-2 pb-1 h-100 top-rounded bottom-rounded flex-grow-1">
          <div className="add-remove-round1 add-remove-height height-53 px-3 bg-gray pt-2 pb-3 top-rounded d-flex flex-wrap justify-content-between align-items-center">
            <h3 className="main-heading font-size-16 float-left">Streaming</h3>
            <div className="host-header">
              <img src="images/mute-microphone.png" className="unmute-icon" id="mute-unmute-local" />
              <img src="images/music-icon.png" className="music-icon" data-toggle="modal" data-target="#musicList" id="bg-music" />
              <img src="images/video-icon.png" className="video-icon d-none" id="publish" />
              <img src="images/video-close.png" className="video-icon d-none" id="unpublish" />
              <img src="images/reverse-cam.png" className="video-icon" id="switch-camera" />
              <img src="images/circle.png" className="circle-icon mr-0" id="record-stream" />
            </div>
          </div>
            <div id="agora_local" className="video-streams"></div>
          </div>
          
        </div>
      </div>

      {scriptHtml}

    </div>
    {/* <!-- Music Player PopUp Start --> */}
      {/* <div className="modal music-list" id="musicList">
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
      </div> */}
      <div className="modal music-list" id="musicList">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-black p-3 rounded-0">
            <div className="rounded bg-gray">
            
            <div className="modal-header bg-gray rounded-top pb-0 px-2">
              <button type="button" className="close pl-1" data-dismiss="modal">&times;</button>
              <p className="small_font pr-1">Change Playlist <img src="images/plylst.png" className="ml-2" alt="chage playlist" /></p>
            </div>
            
            <div className="modal-body bg-gray rounded-bottom">
              <div className="top_container">
                <div className="row pb-3 mt-1">
                  <div className="col-md-2 text-center">
                    <img src="images/p1.png" alt="" className="img-fluid rounded" />
                    </div>
                    <div className="col-md-10 pt-4">
                      <div className="d-md-flex d-block flex-wrap">
                        <div className="flex-fill">
                          <h5 className="white_hdng font-medium heading_text">If I Can’t Have You</h5>
                          <span className="small_font d-block">Shawn Mendes • If I Can’t Have You</span>
                        </div>
                        <div className="flex-fill">
                          <div className="d-flex justify-content-md-end control-music pr-1 flex-wrap mt-3 mt-md-0">
                            <img src="images/volume-icon.png" className="mr-3 align-self-center" alt="volume icon" />
                            {/* <img src="images/active-volume.png" className="align-self-center ml-1" alt="active volume icon" />
                            <img src="images/volume-grey.png" className="mr-4 align-self-center" alt="gray icon" /> */}
                            <div className="gray_bar mr-4 align-self-center"></div>
                            <img src="images/prev-music.png" className="mr-4 ml-2 align-self-center img1" alt="prev icon" />
                            <img src="images/pause-music.png" className="mx-2 align-self-center" alt="pouse icon" />
                            <img src="images/next-music-icon.png" alt="next icon" className="align-self-center ml-4 img1" />
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
              <ul className="music-playlist mt-2">
                <li className="music_play-list"><a href="#">
                  <span className="spantext">If I Can’t Have You</span>
                  <span>Shawn Mendes • If I Can’t Have You</span>
                  <span>3:10</span>
                </a></li>
                <li className="music_play-list"><a href="#">
                  <span className="spantext">Summer Days (feat Macklemore & Patrick Stump of Fall Out Boy)</span>
                  <span>Shawn Mendes • If I Can’t Have You</span>
                  <span>3:10</span>
                </a></li>
                <li className="music_play-list"><a href="#">
                  <span className="spantext">All Around The World(La La La)</span>
                  <span>Shawn Mendes • If I Can’t Have You</span>
                  <span>3:10</span>
                </a></li>
                <li className="music_play-list"><a href="#">
                <span className="spantext">All Around The World(La La La)</span>
                  <span>Shawn Mendes • If I Can’t Have You</span>
                  <span>3:10</span>
                </a></li>
                <li className="music_play-list"><a href="#">
                <span className="spantext">All Around The World(La La La)</span>
                  <span>Shawn Mendes • If I Can’t Have You</span>
                  <span>3:10</span>
                </a></li>            
              </ul>
            </div>
            </div>         
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
      


      {/* <div id="show-details1" className="show-details modal fade " role="dialog">
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
                      <div className="col-12 col-sm-4 d-flex align-items-center">
                        <img className="mx-auto d-block mw-75" src={ opt.image != '' ? 'images/'+opt.image : 'images/product.png'} />
                      </div>
                      
                      <div className="col-12 col-sm-8 detail-model item-description">
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
    </div> */}
    <div className="modal show px-0 details_model" id="show-details2">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-0">
                
                <div className="modal-body py-0">
                    <div className="row">
                        <div className="col-lg-6 px-0">
                          <div className="per_pic rounded h-100">
                            <img src="images/person_pic.png" className="w-100 rounded h-100" />
                          </div>

                        </div>
                        <div className="col-lg-6 px-0">
                          <div className="rgt_modal_box rounded py-5 px-4 h-100">
                          <div className="modal-header border-0 pt-0">
                          <p className="pl-0 mb-0">Friday May 3rd, 2019</p>
                          <button type="button" className="close close-model-btn m-0" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal_contnt">
                                
                                <h3 className="white_hdng mt-4">Experience the world of Lynmar Estates</h3>
                                <p className="white-text pl-0">By Lynn Fritz</p>
                                <div className="mt-3">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <div className="overflow-hidden mr-3">
                                                <p className="float-left"><img src="images/clock.png" className="clock_img" />Time</p>
                                                <p className="float-right">7 PM EDT</p>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="overflow-hidden ml-3">
                                                <p className="float-left"><img src="images/clock.png" className="clock_img" />Length</p>
                                                <p className="float-right">2Hrs</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 className="white-text mb-2 ml-0 p-0"><img src="images/privacy.png" className="mr-3 mb-2" />Privacy</h3>
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7">Allow other users to see my name and picture</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 pr-0">
                                            <div className="form-group1 input-txt position-relative text-right">
                                                <label className="switch mx-0">
                                                    <input type="checkbox" />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>                                        
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7">Allow other users to see my name and picture</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 pr-0">
                                            <div className="form-group1 input-txt position-relative text-right">
                                                <label className="switch mx-0">
                                                    <input type="checkbox" />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>                                        
                                        </div>
                                    </div>
                                       <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">                                                
                                                <p className="my-2 ml-7">Allow other users to send me private message</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 pr-0">                                            
                                            <div className="form-group1 input-txt position-relative text-right">
                                                <label className="switch mx-0">
                                                    <input type="checkbox" />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 className="white-text mb-2 ml-0 p-0"><img src="images/equip.png" className="mr-3 mb-2" />Equipment</h3>
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Corkscrew Wine Opener</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 p-0">
                                            <label className="custom-control custom-checkbox lebelheight d-flex mb-0 pl-2">
                                                <input type="checkbox" className="form-radio" />                                   
                                            </label>                                   
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>4 wine glasses per taster. Preferably two white and two red</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 p-0">
                                            <label className="custom-control custom-checkbox lebelheight d-flex mb-0 pl-2">
                                                <input type="checkbox" className="form-radio" />                                   
                                            </label>                                   
                                        </div>
                                    </div>
                                </div>
                                 <div className="mt-4">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 className="white-text mb-2 ml-0 p-0"><img src="images/shopping-icon.png" className="mr-3 mb-2" />Shopping List</h3>
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Lynmar Estates: 2014 Bliss Block Pinot Noir</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 p-0">
                                            <label className="custom-control custom-checkbox lebelheight d-flex mb-0 pl-2">
                                                <input type="checkbox" className="form-radio" />                                   
                                            </label>                                   
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Lynmar Estates: 2016 Block 10 Pinot Noir</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 p-0">
                                            <label className="custom-control custom-checkbox lebelheight d-flex mb-0 pl-2">
                                                <input type="checkbox" className="form-radio" />                                   
                                            </label>                                   
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Lynmar Estates: Quail Hill Estates Chardonnay 2016</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 p-0">
                                            <label className="custom-control custom-checkbox lebelheight d-flex mb-0 pl-2">
                                                <input type="checkbox" className="form-radio" />                                   
                                            </label>                                   
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Lynmar Estates: Quail Hill Estates Chardonnay 2016</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 p-0">
                                            <label className="custom-control custom-checkbox lebelheight d-flex mb-0 pl-2">
                                                <input type="checkbox" className="form-radio" />                                   
                                            </label>                                   
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

      <input type="hidden" id="switch-counter" />
      <input type="hidden" id="selected-participent-id" />
      <input type="hidden" id="to-broadcast" />
      <input type="hidden" id="current-camera" />
      <input type="hidden" id="current-microphone" />

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
        <div id="fitness-ssession-details" className="details_model modal px-0 fade " role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-0">
                
                <div className="modal-body py-0">
                    <div className="row">
                        <div className="col-lg-6 px-0">
                          <div className="per_pic rounded h-100">
                            <img src="images/fitness.png" className="w-100 rounded h-100" />
                          </div>

                        </div>
                        <div className="col-lg-6 px-0">
                          <div className="rgt_modal_box rounded py-5 px-4 h-100">
                          <div className="modal-header pl-0 border-0 pt-0">
                          <p className="pl-0 mb-0">Friday May 3rd, 2019</p>
                          <button type="button" className="close close-model-btn m-0" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal_contnt">
                                
                                <h3 className="white_hdng mt-1">A long title that can come here</h3>
                                <p className="white-text pl-0">By Fitness Coach Match</p>
                                <div className="mt-3">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <div className="overflow-hidden mr-3">
                                                <p className="float-left"><img src="images/clock.png" className="clock_img" /><b>Time</b></p>
                                                <p className="float-right">7 PM EDT</p>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="overflow-hidden ml-3">
                                                <p className="float-left"><img src="images/length.png" className="clock_img" /><b>Length</b></p>
                                                <p className="float-right">2Hrs</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-5">
                                            <div className="overflow-hidden mr-3">
                                                <p className="float-left"><img src="images/user.png" className="clock_img" /><b>Signed Up</b></p>
                                                <p className="float-right">3</p>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="overflow-hidden ml-3">
                                                <p className="float-left"><img src="images/white-dollar.png" className="clock_img1" /><b>Revenue</b></p>
                                                <p className="float-right">$2,000</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 className="white-text mb-2 ml-0 p-0"><img src="images/privacy.png" className="mr-3 mb-2" />Attendee Privacy</h3>
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7">Allow attendees to block video stream to other attendees</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 pr-0">
                                            <div className="form-group1 input-txt position-relative text-right">
                                                <label className="switch mx-0">
                                                    <input type="checkbox" />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>                                        
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7">Allow attendees to block direct message to other attendees</p>              
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 pr-0">
                                            <div className="form-group1 input-txt position-relative text-right">
                                                <label className="switch mx-0">
                                                    <input type="checkbox" />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>                                        
                                        </div>
                                    </div>
                                       <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">                                                
                                                <p className="my-2 ml-7">Allow attendees to select their own playlist</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-sm-2 col-2 pr-0">                                            
                                            <div className="form-group1 input-txt position-relative text-right">
                                                <label className="switch mx-0">
                                                    <input type="checkbox" />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 className="white-text mb-2 ml-0 p-0"><img src="images/equip.png" className="mr-3 mb-2" />Equipment</h3>
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Dumbbell 2kg, 5kg</p>              
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>stretching Belt, 1.5m</p>              
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                 <div className="mt-4">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h3 className="white-text mb-2 ml-0 p-0"><img src="images/shopping-icon.png" className="mr-3 mb-2" />Shopping List</h3>
                                        </div>
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Ironcast Dumbell, 10kg, 5kg, 3kg and more</p>              
                                            </div>
                                        </div>
                                       
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Stretching rubber belt, 1.5m, 2m, 3m</p>              
                                            </div>
                                        </div>
                                       
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Uppercast support for back</p>              
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div className="row mr-2">
                                        <div className="col-lg-11 col-sm-10 col-10">
                                            <div className="mr-3">
                                                <p className="my-2 ml-7"><i className="fa fa-circle mr-3"></i>Ancle bands sizes M, S, XL, XS</p>              
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
    </div>

      <div className="modal attendy-list" id="attendy-list">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Participants List</h4>
              <button type="button" className="close" data-dismiss="modal">×</button>
            </div>
            <div className="modal-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  <th scope="col" className="text-left">Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Visible</th>
                  <th scope="col"># of Sessions</th>
                </tr>
              </thead>
              <tbody id="online-user-list">
              {onlineUsers}                
              </tbody>
            </table>
            </div>
            
          </div>
        </div>
      </div>

      {/* <div className="modal attendy-list" id="switch-camera-popup">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Select Video Camera</h4>
              <button type="button" className="close" data-dismiss="modal">×</button>
            </div>
            <div className="modal-body">
              <div className="row justify-content-center video-streams select-camera" id="video-media-content"></div>
            </div>
            <div className="modal-footer">
              <button type="button" className=" btn-join btn btn-large btn-primary text-uppercase py-1 px-4 rounded " id="camera-switch-btn">Switch</button>
            </div>
          </div>
        </div>
      </div> */}
      <div className="modal" id="switch-camera-popup">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-black rounded-0">
            <div className="modal-header border-0 pb-0">
              <h4 className="modal-title white_hdng mx-3 my-4 font-medium">Camera layout</h4>
              <button type="button" className="close close-model-btn mx-3 my-4" data-dismiss="modal">×</button>
            </div>
            <div className="modal-body pb-5">
              <div className="d-flex justify-content-center py-5" id="video-media-content">
                <div className="camera_box">
                  <div className="d-flex justify-content-between px-2 pt-2 pb-1">
                    <h5 className="white_font font-medium">Camera 1</h5>
                    <label class="custom-control custom-checkbox lebelheight d-flex mb-0 pl-2">
                      <input type="checkbox" class="form-radio" checked />
                    </label>
                  </div>
                  <div className="">
                    <img src="images/camera.png" alt="camera image" />
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
Host.propTypes = {
  logoutUser:PropTypes.func.isRequired,
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