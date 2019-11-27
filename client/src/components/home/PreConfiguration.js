import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, addLogs} from "../../actions/authActions";
import $ from 'jquery';
import moment from 'moment'
 
class PreConfiguration extends Component {

  constructor(props) {
    super(props);
   // this.state = {data : '', allData:''}

   this.state = {
      isLoading: true,
      isHostJoined: '',
      users: [],
      error: null,
      sessionScript: 0,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      userType:-1,
      interest:0,
      alert10Sec:false,
      mediaAccess:false
 
    }
  }

  callfunction(){
    // $('#logout_button').trigger('click');
    window.leaveLogout();
  }

  loadScript = function (src) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    
    var body = document.getElementsByTagName('html')[0];
    body.appendChild(tag);
  }

  removeScript = function (src) {
    console.log('src========', src)
    // let scpt = $('script');
    // $('script').each(function(i){
    //   console.log('_________________',$(this).attr('src'),src);
    //   if($(this).attr('src').indexOf(src) !== -1){
    //     $(this).remove();
    //     return '';
    //   }
    // })

    // function removejscssfile(filename, filetype){
    var targetelement="script" //determine element type to create nodelist from
    var targetattr="src" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(src)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
    // }

  }

  componentDidMount(){
    $(document).ready(function(){
      $(".close-model-btn").click(function(){
      
      $(".modal-backdrop").remove();
      $(".show-details").removeClass("show").hide();
            $("body").removeClass("modal-open");
    })
    })

    this.loadScript('/AgoraRTCSDK-2.7.1.js');
    this.loadScript('/agora-rtm-sdk-1.0.0.js');
    this.loadScript('/pre-main.js');
    this.loadScript('/check-rule.js');

    this.fetchUsers();

    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    this.setState({sessionScript: localstoragedata.sessionData.id});
    let scDate = localstoragedata.sessionData.scheduleDate;

    // console.log('scDate= ',scDate, new Date(scDate).getTime(), new Date().getTime())

    /*let currDate = new Date();
    currDate.setMinutes(currDate.getMinutes() + 330); // adding 330 minutes for matching IST time
    scDate = (new Date(scDate).getTime()) - (new Date(currDate).getTime());*/

    scDate = (new Date(scDate).getTime()) - (new Date().getTime());
    this.setState({timerTime: scDate}); // 1 sec 1000 = 1sec
    this.setState({interest:localstoragedata.sessionData.code});

    this.countdownTimer(localstoragedata.sessionData.scheduleDate);
  }

  componentWillMount(){
    this.startTimer();
  }
 

  checkstatus = () => {

    let storedt = JSON.parse(localStorage.getItem('userData'));

    if(storedt.userType == 2)
    {
      this.setState({
        isHostJoined: true
      });
    }
  }

  checkMediaAccess = () => {
      this.setState({
        mediaAccess: true
      });
  }

  joinSession = () => {
       
      if(JSON.parse(localStorage.getItem('userData')).userType == 2) {

        let sessionTime = localStorage.getItem("pre-session-time");
        console.log('----sessionTime----', sessionTime);
        if(sessionTime != null){
          sessionTime = JSON.parse(sessionTime);
          sessionTime['joinTime'] = (new Date()).getTime();
          localStorage.setItem("pre-session-time", JSON.stringify(sessionTime));
        }
      }

      console.log('#####join####button########');
      
      window.joinChannel();

      console.log('#####joinchannel########');
      
      window.removePreScreenSession();

      this.removeScript('/AgoraRTCSDK-2.7.1.js');
      this.removeScript('/agora-rtm-sdk-1.0.0.js');
      this.removeScript('/pre-main.js');
      this.loadScript('/check-rule.js');

      window.participentTimerAlertClose();
      window.participentStreamTimerAlertClose();
      
      let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    // this.setState({userType : localstoragedata.userType})
      
      if(localstoragedata.userType != ''){
        let mediaSetting = {};
        mediaSetting['camera'] = $('input[name="video-type"]').length > 0 ? $('input[name="video-type"]:checked').val():null;
        mediaSetting['microphone'] = $('input[name="audio-type"]').length > 0 ? $('input[name="audio-type"]:checked').val():null;
        localStorage.setItem("media-setting", JSON.stringify(mediaSetting));

        // let device = {microphone : $('input[name="audio-type"]:checked').val(), camera : $('input[name="video-type"]:checked').val()}
        // console.log('device', device, localstoragedata.userType)

        if(localstoragedata.userType == 1){
          this.props.history.push("/host");
        }
        else{
          this.props.history.push("/guest");
        }

      } else {
        this.props.history.push("/login");
      }
  }

  joinSessionByFirst = () => {
    if(JSON.parse(localStorage.getItem('userData')).userType != 1){

      let sessionTime = localStorage.getItem("pre-session-time");
      if(sessionTime != ''){
        sessionTime = JSON.parse(sessionTime);
        sessionTime['joinTime'] = (new Date()).getTime();
        localStorage.setItem("pre-session-time", JSON.stringify(sessionTime));
      }
    }
    this.joinSession();
  };

  addLog = (sessionId, userType, type) => {
    
    this.props.addLogs(sessionId, userType, type);
  };

  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: this.state.timerTime
    });

        
    /*this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 10;

      let remSec = Math.floor(newTime / 1000);

      //console.log('remSec *********** ', remSec)
      if(remSec > 0 && remSec < 10){
        this.setState({
          timerTime: newTime
        });
        if(!this.state.alert10Sec){
          this.setState({
            alert10Sec: true
          });
          window.timerAlert();
        }
      }else if (newTime >= 0) {
        this.setState({
          timerTime: newTime
        });
      } else {
        clearInterval(this.timer);
        this.setState({ timerOn: false });
        $('.countdown-timer').html('Session Started')
      }
    }, 10);*/
  };

  userList(userList) {
      console.log('tempUsers',localStorage.getItem("tempUsers"))
      localStorage.setItem("tempUsers", JSON.stringify(userList));
    // }
  }

  countdownTimer(sessionDate) {

    var deadline = new Date(sessionDate).getTime();

    var x = setInterval(function() {
          var now = new Date().getTime(); 
          var t = deadline - now;

          var seconds = ("0" + (Math.floor((t / 1000) % 60) % 60)).slice(-2);
          var minutes = ("0" + Math.floor((t / 60000) % 60)).slice(-2);
          var hours = Math.floor((t / 3600000));
          
          if(hours >= 100) {
            hours = ("0" + hours).slice(-3);
          } else {
            hours = ("0" + hours).slice(-2);
          }

          let time = hours + ' : ' + minutes + ' : ' + seconds;
          $('.countdown-timer').text(time);

          if (t < 0) {
              clearInterval(x);
              $('.countdown-timer').text('Session Started');

              let userData = JSON.parse(localStorage.getItem("userData"));

              if(userData.userType == 1) {
                  var redirectCounter = setInterval(function() {

                    if(localStorage.getItem("video-resolution") != null && localStorage.getItem('mediaAccessAllowed')  !== null && localStorage.getItem('mediaAccessAllowed')  == "true") {

                        clearInterval(redirectCounter);

                        if($('#video-media-content .col-md-3').length > 1 || $('#audio-media-content div').length > 1) {
                            window.multimediaAccessAlert();
                        } else {
                            $('#continue-join').click();
                        }
                    }
                  }, 1000);
              }
          }
    }, 1000); 
  }

  fetchUsers() {
    var userData = JSON.parse(localStorage.getItem("userData"));
    //var  userID=userData.id;
      
      var sessionId=userData.sessionData.sessionId;
    
    fetch("/api/v1/session/"+sessionId+"/users", {headers : {'Authorization': userData.token}})
    .then(response => response.json())
    // ...then we update the users state
    .then(data => {
      data = data.responseData;
        this.setState({
              users: data,
              isLoading: false,
              });
      this.userList(data);

      if(userData.userType == 2)
      {
        data.forEach(element => {

          if(element.userType == 1 && element.sessionStatus == 1 )
          {
            
          this.setState({
            isHostJoined: true
          });

            let sessionTime = {};
            sessionTime['startTime'] = (new Date()).getTime();
            sessionTime['joinTime'] = ''
            localStorage.setItem("pre-session-time", JSON.stringify(sessionTime));
          }

        });
      }
    }
    )
  }

  joinAlert = () => {
    $('#continue-join').trigger('click');
  };



render() {

  const { timerTime, timerStart, timerOn, sessionScript, interest } = this.state;

    /*let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);
    //let hours = ("0" + Math.floor((timerTime / 3600000))).slice(-2);
    let hours = Math.floor((timerTime / 3600000));
    
    if(hours >= 100) {
      hours = ("0" + hours).slice(-3);
    } else {
      hours = ("0" + hours).slice(-2);
    }*/

  //console.log('seconds, minutes, hours====== ', seconds, minutes, hours);
  //const  {user}  = this.props.auth;

  //console.log('------virender----users ', this.state.isHostJoined)

  let localstoragedata = JSON.parse(localStorage.getItem('userData'));

  let sessionData = localstoragedata.sessionData;
 // console.log('sessionData-0---', sessionData);
  /*let scheduledDate = new Date(sessionData.scheduleDate);
  scheduledDate.setMinutes(scheduledDate.getMinutes() - 330);
  let localDate = moment(scheduledDate).format('MM/DD/YYYY # h:mm a');*/

  let localDate = moment(sessionData.scheduleDate).format('MM/DD/YYYY # h:mm a');
  localDate = localDate.replace('#', 'at');
  let remTime = '';

  let sessionStartDate = moment(sessionData.scheduleDate).format('dddd MMM Do, YYYY');
  let sessionStartTime = moment(sessionData.scheduleDate).format('h:mm A');

  // console.log('sessionData sessionData',sessionData );
  let logo = sessionData.logo;
  
  var totalTime = sessionData.duration;
  var totalhours = Math.floor(totalTime / 60);          
  var totalMinutes = totalTime % 60;
  var sessionDuration = '';

  if (totalhours >= 1) {
      sessionDuration = sessionDuration + '' + totalhours + ' Hr';
  }

  if (totalMinutes >= 1) {
      sessionDuration = sessionDuration + ' ' + totalMinutes + ' mins';
  }

  let onlineUsers = '';
  let participent = '';
  let participentTimerPopup = '';
  if(localstoragedata.userType == 1){
    
    participent = <img src="images/list-icon.png" data-toggle="modal" data-target="#attendy-list" className="open-list" />;

    onlineUsers = this.state.users.map((user, idx) => {
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
  } else {
    participentTimerPopup = (<div id="participent-timer-alert" className="modal fade">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Join Session</h4>  
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div className="modal-body">
              <div>Please join in next <span id="rem-join-timer">{localstoragedata.default.maxJoinDuration}</span> sec else you will become an audience.</div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" onClick={this.joinSessionByFirst}>Join</button>
            </div>
          </div>
        </div>
      </div>);
  }
  
      // var allData= this.props.dispatch(allUsers(sessionId));
      var userlength=this.state.users;

      var newulength=Object.keys(userlength).length;
      newulength = newulength < 1 ? 0 : --newulength ;
    
  //$("body").css("overflow-y", "scroll");
  

  return (
       <div>
      <div className="prescreen-popup" id="media-config">

      <div className="mw-100" role="document">

        <div className="modal-content">

        <div className="modal-header">
        
          <div className="d-flex w-100 justify-content-between  flex-md-nowrap flex-wrap">
            <div className="d-flex align-items-center rounded bg-gray session-logo mx-md-0 mx-auto">
              <img src={ logo } />
            </div>
            <div className="session-details bg-gray flex-grow-1 my-2 my-md-0 mx-md-2">
                <div className="row">
                  <div className="col-lg-8">
                    <h4 className="small-heading">Your Upcoming Session</h4>
                    <h3 className="popup-heading">{sessionData.name}<span>by <label className="welcome-title trim-text">{sessionData.hostFirstName.toLowerCase()}  {sessionData.hostLastName.toLowerCase()}</label></span>
                      {localstoragedata.userType == 1 ? (
                          <span className="green-online online-status" id="online_state"><span>ONLINE</span></span>
                        ) : (<span className="green-online online-status d-none" id="online_state"><span>ONLINE</span></span>)}
                    </h3>
                    <div className="time py-xs-1">  
                      <span className="no-border">{localDate}</span>
                    </div>
                  </div>
                  <div className="col-lg-4 float-right time-session">
                    {/*<span className="countdown-timer">{hours} : {minutes} : {seconds}</span>*/}
                    <span className="countdown-timer"></span>
                    
                    {(
                        ()=>{
                            if(sessionData.interestId == 1) {
                                return <a href="#!" data-toggle="modal" data-target="#show-details2" className="btn btn-primary float-right">Session Details</a>;
                            } else {                      
                                {/*return <a className="btn btn-primary border-right pr-20" href="#!" data-toggle="modal" data-target="#fitness-script" tabIndex="1">Session Details</a>;*/}
                                return <a className="btn btn-primary border-right pr-20" href="javascript:void(0)" tabIndex="1">Session Details</a>;
                            }
                        }
                    )()}

                  </div>
                  <div className="text-danger" style={{color:'#fff'}} id="exptn-errors"></div>
                </div>
            </div>
            <div className="participant-status bg-gray mx-md-0 mx-auto">
              
            <h4 className="small-heading">Participants {participent}</h4>
                <div className="mt-3">
                  <div className="row">
                    <div className="col-lg-6 border-right-gray2">
                      <span className="signup-total">Signed up</span>
                      <span className="signup-number" id="totalsignup">{newulength}</span>
                    </div>
                    <div className="col-lg-6">
                      <span className="online-total">Online</span>
                      <span className="online-number" id="totalonline">0</span>
                    </div>
                  </div>
                  
                </div>
            </div>
          </div>

        </div>
        
        <div className="prescreen-body modal-body bg-gray rounded my-2" id="media-content">
          
          <div className="row">
            <div className="col-12"><h6 className="small-heading mb-2">Select Video Camera</h6></div>           
            
          </div>
          <div className="row justify-content-center video-streams select-camera" id="video-media-content"></div>
        
        </div>
        <div className="d-flex prescreen-footer">
          <div className=" network-wifi mb-2 mb-md-0 pb-0">
            <div className="bg-gray h-100 position-relative pad15 pb-0 rounded">
              <h6 className="small-heading mb-3">Network Reliability</h6>
                
              <div className="fill-wifi waveStrength-0">
                <div className="wv4 wave">
                  <div className="wv3 wave">
                    <div className="wv2 wave">
                      <div className="wv1 wave">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {localstoragedata.userType == 1 ? (<div className="row">
                  <div className="online-streams d-flex justify-content-between">
                    <span className="online-total">Online streams on screen</span>
                    {/* <span className="signup-number" >{localstoragedata.default.maxUserLimit}</span> */}

                    <span className="signup-number translate1" >

                      {(
                          ()=>{
                              if(newulength >= localstoragedata.default.maxUserLimit) {
                                  return localstoragedata.default.maxUserLimit;
                              } else {                      
                                  return newulength;
                              }
                          }
                      )()}

                    </span>

                  </div>
                  
                </div>) : (<div><div className="row mt-5"></div></div>)}
            </div>
          </div>
          <div className="flex-grow-1 select-audio">
            <div className="h-100 bg-gray position-relative pad15 rounded">
              <h6 className="small-heading mb-0">Select Microphone</h6>
              <div className="col-lg-12">
                <div className="row check-camera detect-mic flex-wrap" id="audio-media-content"></div>
              </div>
            </div>
          </div>
          { interest == 101 ? 
            (<div className="heart-rate">
            <div className="h-100 bg-gray position-relative pad15 rounded">
              <span className="online-total text-left">Heart Rate Monitor detected</span>
              <span className="signup-number font-20 text-left" id="heartrate" >NO</span>
            </div>
          </div>) : ('')
          }
          
        </div>
        

        {/* <div id="show-details2" className="show-details modal fade" role="dialog">
        <div className="modal-dialog w-100 d-flex align-items-center bg-black flex-direction-column h-100 mw-100 justify-content-center ">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close close-model-btn m-0" data-dismiss="modal">&times;</button>
          </div>
           <div className="row no-gutters">
            <div className="col-12 col-sm-12">
              
            <div id="carouselExampleIndicators" className="width-1000 carousel slide" data-ride="carousel">
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
                        <img className="mx-auto d-block mw-75" src={ opt.image != null ? 'images/'+opt.image : 'images/product.png'} />
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
    </div> */}
    <div className="modal show px-0" id="show-details2">
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
                          <div className="modal-header">
                          <p className="pl-0 mb-0">{sessionStartDate}</p>
                          <button type="button" className="close close-model-btn m-0" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal_contnt">
                                
                                <h3 className="white_hdng mt-4">{sessionData.name}</h3>
                                <p className="white-text pl-0">By {sessionData.hostFirstName + ' ' + sessionData.hostLastName}</p>
                                <div className="mt-3">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <div className="overflow-hidden mr-3">
                                                <p className="float-left"><img src="images/clock.png" className="clock_img" />Time</p>
                                                <p className="float-right">{sessionStartTime} EDT</p>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="overflow-hidden ml-3">
                                                <p className="float-left"><img src="images/length.png" className="clock_img" />Length</p>
                                                <p className="float-right">{sessionDuration}</p>
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
                                                <p className="my-2 ml-7">Allow other users to contact me</p>              
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
        <div className="modal-footer">
            {/* <div className="">
            <input type="checkbox" id="set-default" /><label htmlFor="set-default">Save as Default Setting</label>
            </div> */}
             
              <div className="col-lg-9">
              
                <h6 className="small-heading mb-0 no-border">Joined</h6>
                <span id='newmsg' className="welcome-msg"></span>
                <div className="">
                  <div className="joiners d-flex flex-wrap">
                    
                    <div className="d-flex flex-wrap" id="joiners"></div>  
                    
                    <span className="color-purple" id="total-joinees"></span>

                  </div>
                </div>

              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end flex-wrap">

                  <button type="submit" className="mr-4 btn-cancel btn btn-large btn-leave btn-outline-secondary rounded py-3 px-4" onClick={this.callfunction.bind(this)} >Leave</button>
                  
                  {(
                    ()=>{
                        if(localstoragedata.userType == 1) {
                            //return <button type="button" className="w110 btn-join btn btn-large btn-primary text-uppercase py-1 px-4 rounded " data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession.bind(this)} disabled={!this.state.mediaAccess}>Join</button>;

                            {/*if (localstoragedata.default.showJoinButton == 1) {
                                return <button type="button" className="w110 btn-join btn btn-large btn-primary text-uppercase py-1 px-4 rounded" data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession.bind(this)}>Join</button>;
                            } else {*/}
                                return <button type="button" className="w110 btn-join btn btn-large btn-primary text-uppercase py-1 px-4 rounded d-none" data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession.bind(this)}>Join</button>;
                            {/*}*/}
                        } else {
                            return <button type="button" className="w110 btn-join btn btn-large btn-primary text-uppercase py-1 px-3 rounded d-none" data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession.bind(this)} disabled={!this.state.isHostJoined}>Join</button>;                     
                        }
                      //   if(localstoragedata.userType == 1) {
                      //     return <button type="button" className="w110 btn-join btn btn-large btn-primary text-uppercase py-1 px-4 rounded " data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession.bind(this)}>Join</button>;
                      // }
                    }
                  )()}

                </div>
              </div>
            
        </div>

        </div>

      </div>

      </div>

     <div id="timer-alert" className="modal fade">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Are you sure?</h4>  
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div className="modal-body">
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" onClick={this.joinAlert}>Join</button>
            </div>
          </div>
        </div>
      </div>

      {/*participentTimerPopup*/}

      <div id="participent-stream-redirect-alert" className="modal fade" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Joining Session</h4>  
                {/* <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button> */}
            </div>
            <div className="modal-body">
              <div>You will be redirected in <strong><span id="stream-rem-join-timer">{localstoragedata.default.streamRedirectDuration}</span></strong> seconds</div>
            </div>
            {/*<div className="modal-footer">
              <button type="button" className="btn btn-success" onClick={this.joinSessionByFirst}>Join</button>
            </div>*/}
          </div>
        </div>
      </div>

      <div id="bandwidth-low-alert" className="modal fade" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Bandwidth too low</h4></div>
            <div className="modal-body">
              <div>Your network bandwidth is too low for joining session at Virdio</div>
            </div>
          </div>
        </div>
      </div>

      <div id="media-access-alert" className="modal fade" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Virdio can't access your camera and microphone</h5>  
            </div>
            <div className="modal-body">
              <div>Click the X icon in the URL bar above to give Virdio access to your camera and microphone</div>
            </div>
          </div>
        </div>
      </div>

      <div id="multi-media-access-alert" className="modal fade" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Camera & Microphone</h5>
            </div>
            <div className="modal-body">
              <div>
                The Virdio application has selected your default camera and microphone.
If you have any other preferences, you can use the camera and microphone options provided in the main screen. After the selection of preferred camera and microphone a JOIN button will be enabled to take you through the session.
                Do you want to continue with your default settings? <a href="javascript:void(0)" id="proceed">Yes</a> <a href="javascript:void(0)" id="change-setting">No</a>
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

      <button id="set-temp-sesstion" onClick={this.checkstatus} hidden="hidden">cccc</button>
      <button id="set-media-access" onClick={this.checkMediaAccess} hidden="hidden">cam</button>

      
      {/* <div className="modal attendy-list fitness-script1" id="fitness-script">
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
                                    } else if(opt1.attrLabel.toLowerCase() == 'target zone' && sessionData.zoneTracking == 1  ) {                      
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
      </div> */}
       <div id="fitness-script" className="details_model modal px-0 fade " role="dialog">
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
      <span id="joiner-name-width" style={{color:'#000'}}></span>
      </div>
    );
  }
}
PreConfiguration.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  addLogs: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser,addLogs }
)(PreConfiguration);