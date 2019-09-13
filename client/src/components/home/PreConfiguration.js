import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser} from "../../actions/authActions";
import $ from 'jquery';
import moment from 'moment'
 
class PreConfiguration extends Component {

  constructor(props) {
    super(props);
   // this.state = {data : '', allData:''}

   this.state = {
      isLoading: true,
      users: [],
      error: null,
      sessionScript: 0,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      userType:-1,
      interest:0
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
    $('script').each(function(i){
      console.log('_________________',$(this).attr('src'),src);
      if($(this).attr('src').indexOf(src) !== -1){
        $(this).remove();
        return '';
      }
    })
  }

  componentDidMount(){

    this.loadScript('/AgoraRTCSDK-2.7.1.js');
    this.loadScript('/agora-rtm-sdk-1.0.0.js');
    this.loadScript('/pre-main.js');

    this.fetchUsers();
    

    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    this.setState({sessionScript: localstoragedata.sessionData.id});
    let scDate = localstoragedata.sessionData.scheduleDate;

    //console.log('scDate= ',scDate, new Date(scDate).getTime(), new Date().getTime())

    scDate = (new Date(scDate).getTime()) - (new Date().getTime());
    // console.log('scDate- ', scDate)
    this.setState({timerTime: scDate});// 1 sec 1000 = 1sec
    this.setState({interest:localstoragedata.sessionData.code});
  }
  componentWillMount(){
    // this.fetchUsers();
    //console.log(1);
    // window.test();
    this.startTimer();
    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    this.setState({userType : localstoragedata.userType})
    console.log('$$$$$$$$$$$$$$$',localstoragedata.userType, this.state.userType);

  }

  joinSession = () => {
      // console.log('#############', this.state.userType);
      
      window.removePreScreenSession();

      this.removeScript('/AgoraRTCSDK-2.7.1.js');
      this.removeScript('/agora-rtm-sdk-1.0.0.js');
      this.removeScript('/pre-main.js');

      if(this.state.userType != -1){
        let mediaSetting = {};
        mediaSetting['camera'] = $('input[name="video-type"]').length > 0 ? $('input[name="video-type"]:checked').val():null;
        mediaSetting['microphone'] = $('input[name="audio-type"]').length > 0 ? $('input[name="audio-type"]:checked').val():null;
        localStorage.setItem("media-setting", JSON.stringify(mediaSetting));

        // let device = {microphone : $('input[name="audio-type"]:checked').val(), camera : $('input[name="video-type"]:checked').val()}
        // console.log('device', device, this.state.userType)
        if(this.state.userType == 1){
          this.props.history.push("/host");
        }
        else{
          this.props.history.push("/guest");
        }

      } else {
        this.props.history.push("/login");
      }
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
    }
    )
      }

render() {

  const { timerTime, timerStart, timerOn, sessionScript, interest } = this.state;

  let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
  let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);
  let hours = ("0" + Math.floor((timerTime / 3600000) % 60)).slice(-2);
      console.log('interest====== ', interest);
  //const  {user}  = this.props.auth;

  let localstoragedata = JSON.parse(localStorage.getItem('userData'));
  let sessionData = localstoragedata.sessionData;
 
  let localDate = moment(sessionData.scheduleDate).format('MM/DD/YYYY # h:mm a');

  localDate = localDate.replace('#', 'at');
  let remTime = '';
  //console.log('scheduleDate ',localDate );
  
  //console.log('------hhhhhhhh----users ', this.state.users)
  let onlineUsers = '';
  let participent = '';
  if(localstoragedata.userType == 1){
    
    participent = <img src="images/list-icon.png" data-toggle="modal" data-target="#attendy-list" className="open-list" />;

    onlineUsers = this.state.users.map((user, idx) => {
      if(user.userType != 1) {
        const { username, name, email } = user;
        return (
          <tr key={idx}>
          <th scope="row"><img src="/images/avtar.png" /></th>
          <td>{name}</td>
          <td>{email}</td>
          <td><img className="mr-2" src="/images/online.png" />online</td>
          <td>YES</td>
          <td>5</td>
        </tr>
        );
      }
    })
  }


      // var allData= this.props.dispatch(allUsers(sessionId));
      var userlength=this.state.users;

      const newulength=Object.keys(userlength).length;

      // console.log('-----------Avishekhllllll-------------------', newulength)

      // const storeData = JSON.parse(localStorage.getItem("userData"));
      // console.log('-----------Avishekhllllll-------------------', storeData.sessionData.hostName)

  
  return (
       <div>
      <div className="prescreen-popup" id="media-config">

      <div className="mw-100" role="document">

        <div className="modal-content">

        <div className="modal-header">
        
          <div className="d-flex w-100 justify-content-between  flex-md-nowrap flex-wrap">
            <div className="d-flex align-items-center rounded bg-gray session-logo mx-md-0 mx-auto">
              <img src="/images/prescreen-logo.png" />
            </div>
            <div className="session-details bg-gray flex-grow-1 my-2 my-md-0 mx-md-2">
                <div className="row">
                  <div className="col-lg-9">
                    <h4 className="small-heading">Your Upcoming Session</h4>
                    <h3 className="popup-heading">{sessionData.name}<span>by {sessionData.hostName.toLowerCase()}</span><span className="green-online" id="online_state">ONLINE</span></h3>
                    <div className="time py-xs-1">  
                      <span className="no-border">{localDate}</span>
                    </div>
                  </div>
                  <div className="col-lg-3 float-right time-session">
                    <span className="countdown-timer">{hours} : {minutes} : {seconds}</span>
                    <a href="#" className="btn btn-primary float-right">Session details</a>
                  </div>
                </div>
            </div>
            <div className="participant-status bg-gray session-logo mx-md-0 mx-auto">
              
            <h4 className="small-heading">Participants {participent}</h4>
                <div className="col-lg-12 mt-3">
                  <div className="row">
                    <div className="col-lg-6 border-right-gray">
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
        <div className="row four-gutters">
          <div className="col-12 col-md-3 col-lg-3">
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
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <span className="online-total">Online streams on screen</span>
                  
                </div>
                <div className="col-lg-4 col-md-6">
                  <span className="signup-number" >142</span>
                </div>
              </div>
            </div>
          </div>
          <div className={ interest == 101 ? ("col-12 col-md-7 col-lg-7 my-2 my-md-0") : ("col-12 col-md-9 col-lg-9 my-2 my-md-0")}>
            <div className="h-100 bg-gray position-relative pad15 rounded">
              <h6 className="small-heading mb-0">Select Microphone</h6>
              <div className="col-lg-12">
                <div className="row check-camera detect-mic flex-wrap" id="audio-media-content"></div>
              </div>
            </div>
          </div>
          { interest == 101 ? 
            (<div className="col-12 col-md-2 col-lg-2">
              <div className="h-100 bg-gray position-relative pad15 rounded">
                <span className="online-total text-left">Heart Rate Monitor detected</span>
                <span className="signup-number font-20 text-left" >NO</span>
              </div>
            </div>) : ('')
          }
          
        </div>
        

        <div className="modal-footer">
            {/* <div className="">
            <input type="checkbox" id="set-default" /><label htmlFor="set-default">Save as Default Setting</label>
            </div> */}
             
              <div className="col-lg-9">
              <span id='newmsg' style={{color:'green'}}></span>
                <h6 className="small-heading mb-3 no-border">Just joined</h6>
                <div className="d-none">
                  <div className="joiners d-flex flex-wrap">
                    <span>
                      <img src="images/avtar.png" />
                      Richard, LA
                    </span>
                    <span>
                      <img src="images/avtar.png" />
                      Richard, LA
                    </span>
                    <span>
                      <img src="images/avtar.png" />
                      Richard, LA
                    </span>
                    <span>
                      <img src="images/avtar.png" />
                      Richard, LA
                    </span>
                    
                    <span className="color-purple">
                      +34 more
                    </span>
                  </div>
                </div>

              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end flex-wrap">

                  <button type="submit" className="mr-2 btn-cancel btn btn-large btn-outline-secondary rounded py-1 px-3" onClick={this.callfunction.bind(this)} >Leave</button>
                  {(
                    ()=>{
                        if(localstoragedata.userType == 1) {
                          return <button type="button" className="btn-join btn btn-large btn-primary text-uppercase py-1 px-3 rounded dis" data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession}>Join</button>;
                        } else {
                          return <button type="button" className="btn-join btn btn-large btn-primary text-uppercase py-1 px-3 rounded dis" data-attr={localstoragedata.userType} id="continue-join" onClick={this.joinSession}>Join</button>;
                        }
                    }
                  )()}

                </div>
              </div>
            
        </div>

        </div>

      </div>

      </div>
      <div className="modal attendy-list" id="attendy-list">
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title">Participants List</h4>
              <button type="button" className="close" data-dismiss="modal">×</button>
            </div>
            {/* Modal body */}
            <div className="modal-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Visible</th>
                  <th scope="col"># of Sessions</th>
                </tr>
              </thead>
              <tbody>
              { onlineUsers }                
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
  // joinSession: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(PreConfiguration);