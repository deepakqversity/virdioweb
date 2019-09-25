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
      isHostJoined: false,
      users: [],
      error: null,
      sessionScript: 0,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      userType:-1,
      interest:0,
      alert10Sec:false,
      isHostJoined:false
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

    this.loadScript('/AgoraRTCSDK-2.7.1.js');
    this.loadScript('/agora-rtm-sdk-1.0.0.js');
    this.loadScript('/pre-main.js');

    this.fetchUsers();


    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    this.setState({sessionScript: localstoragedata.sessionData.id});
    let scDate = localstoragedata.sessionData.scheduleDate;

    // console.log('scDate= ',scDate, new Date(scDate).getTime(), new Date().getTime())

    scDate = (new Date(scDate).getTime()) - (new Date().getTime());
    // console.log('scDate- ', scDate)
    this.setState({timerTime: scDate});// 1 sec 1000 = 1sec
    this.setState({interest:localstoragedata.sessionData.code});
  }
  componentWillMount(){
    this.startTimer();
  }

  joinAttendies(){
    alert('hi');
  }

  joinSession = () => {
     // console.log('#############');

      //alert('hello');
      
      window.joinChannel();

      // setTimeout(function(){ }, 1000);
      
      window.removePreScreenSession();

      this.removeScript('/AgoraRTCSDK-2.7.1.js');
      this.removeScript('/agora-rtm-sdk-1.0.0.js');
      this.removeScript('/pre-main.js');

      window.participentTimerAlertClose();

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
    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 10;

      let remSec = Math.floor(newTime / 1000);
      // console.log('remSec *********** ', remSec)
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
        //alert("Countdown ended");
      }
    }, 10);
  };

  userList(userList) {
      console.log('tempUsers',localStorage.getItem("tempUsers"))
      localStorage.setItem("tempUsers", JSON.stringify(userList));
    // }
  }

  fetchUsers() {
    var userData = JSON.parse(localStorage.getItem("userData"));
    //var  userID=userData.id;
      
      var sessionId=userData.sessionData.sessionId;
    
    fetch("/api/v1/session/"+sessionId+"/users", {headers : {'Authorization': userData.token}})
    .then(response => response.json())
    // ...then we update the users state
    .then(data => {
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
          //  $('#continue-join').prop("disabled", false);
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

  let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
  let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);
  let hours = ("0" + Math.floor((timerTime / 3600000) % 60)).slice(-2);
      // console.log('seconds, minutes, hours====== ', seconds, minutes, hours);
  //const  {user}  = this.props.auth;

  let localstoragedata = JSON.parse(localStorage.getItem('userData'));

  let sessionData = localstoragedata.sessionData;
 
  let localDate = moment(sessionData.scheduleDate).format('MM/DD/YYYY # h:mm a');

  localDate = localDate.replace('#', 'at');
  let remTime = '';
  // console.log('sessionData sessionData',sessionData );
  let logo = sessionData.logo;
  
  //console.log('------hhhhhhhh----users ', this.state.users)
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
          <td className="visible-status"><i className="fa fa-check text-green"></i><i className="fa fa-times text-red d-none"></i></td>
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

      const newulength=Object.keys(userlength).length;

    
  $("body").css("overflow-y", "scroll");
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
                    <h3 className="popup-heading">{sessionData.name}<span>by <label className="welcome-title trim-text">{sessionData.hostFirstName.toLowerCase()}  {sessionData.hostLastName.toLowerCase()}</label></span><span className="green-online online-status" id="online_state"><span>ONLINE</span></span></h3>
                    <div className="time py-xs-1">  
                      <span className="no-border">{localDate}</span>
                    </div>
                  </div>
                  <div className="col-lg-4 float-right time-session">
                    <span className="countdown-timer">{hours} : {minutes} : {seconds}</span>
                    <a href="#" data-toggle="modal" data-target="#show-details" className="btn btn-primary float-right">Session details</a>
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
                      <span className="online-number" id="totalonline"></span>
                    </div>
                  </div>
                  
                </div>
            </div>
          </div>

        </div>
        
        <div className="prescreen-body modal-body bg-gray rounded my-2" id="media-content">
          
          <div className="row">
            <div className="col-12"><h6 className="small-heading mb-2">Select Video Camera</h6></div>
            <div className="col-12 video-streams select-camera" id="video-media-content"></div>
            
          </div>
        
        </div>
        <div className="d-flex prescreen-footer">
          <div className=" network-wifi mb-2 mb-md-0">
            <div className="bg-gray h-100 position-relative pad15 rounded">
              <h6 className="small-heading mb-3">Network Reliability</h6>
                
              <div className="fill-wifi waveStrength-3">
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
                  <div className="online-streams">
                    <span className="online-total">Online streams on screen</span>
                    <span className="signup-number" >{localstoragedata.default.maxUserLimit}</span>
                  </div>
                  
                </div>) : (<div></div>)}
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
        <div className="modal-footer">
            {/* <div className="">
            <input type="checkbox" id="set-default" /><label htmlFor="set-default">Save as Default Setting</label>
            </div> */}
             
              <div className="col-lg-8">
              {/* <span id='newmsg' style={{color:'green'}}></span> */}
                <h6 className="small-heading mb-3 no-border">Joined</h6>
                <div className="">
                  <div className="joiners d-flex flex-wrap">
                    
                    <div className="d-flex flex-wrap" id="joiners"></div>  
                    
                    <span className="color-purple" id="total-joinees"></span>

                  </div>
                </div>

              </div>
              <div className="col-lg-4">
                <div className="d-flex justify-content-end flex-wrap">

                  <button type="submit" className="w110 mr-4 btn-cancel btn btn-large btn-leave btn-outline-secondary rounded py-1 px-4" onClick={this.callfunction.bind(this)} >Leave</button>
                  {(
                    ()=>{
                        if(localstoragedata.userType == 1) {
                          return <button type="button" className="w110 btn-join btn btn-large btn-primary text-uppercase py-1 px-4 rounded dis" data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession.bind(this)}>Join</button>;
                        } else {

                          if(this.state.isHostJoined == false)
                          {
                            return <button type="button" className="w110 btn-join btn btn-large btn-primary text-uppercase py-1 px-3 rounded dis" data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession.bind(this)} disabled>Join</button>;
                          }else
                          {
                            return <button type="button" className="w110 btn-join btn btn-large btn-primary text-uppercase py-1 px-3 rounded dis" data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession.bind(this)}>Join</button>;
                          }
                        }
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

      {participentTimerPopup}

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