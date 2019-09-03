import React, { Component } from "react";
//import header from '../../config.js';
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import  UserApi from "../../actions/userApi.js";
import { allUsers } from "../../actions/authActions";
import $ from 'jquery';
import moment from 'moment'
class Configuration extends Component {
  
  constructor(props) {
    super(props);
   // this.state = {data : '', allData:''}

   this. state = {
      isLoading: true,
      users: [],
      error: null,
      sessionScript: 0,
      timerOn: false,
      timerStart: 0,
      timerTime: 0
    }
  }

  componentDidMount(){
  this.fetchUsers();

  let localstoragedata = JSON.parse(localStorage.getItem('userData'));
  this.setState({sessionScript: localstoragedata.sessionData.id});
  let scDate = localstoragedata.sessionData.scheduleDate;

  console.log('scDate= ',scDate, new Date(scDate).getTime(), new Date().getTime())

  scDate = (new Date(scDate).getTime()) - (new Date().getTime());
  console.log('scDate- ', scDate)
  this.state.timerTime = scDate;// 1 sec 1000 = 1sec
  }
  componentWillMount(){
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
        //alert("Countdown ended");
      }
    }, 10);
  };



  fetchUsers() {
    var userData = JSON.parse(localStorage.getItem("userData"));
    //var  userID=userData.id;
      
      var sessionId=userData.sessionData.sessionId;
    
    fetch("/api/v1/session/"+sessionId+"/users", {headers : {'Authorization': userData.token}})
    .then(response => response.json())
    // ...then we update the users state
    .then(data =>
      this.setState({
        users: data,
        isLoading: false,
      })
    )
      }


render() {

  const { timerTime, timerStart, timerOn, sessionScript } = this.state;

  let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
  let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);
  let hours = ("0" + Math.floor((timerTime / 3600000) % 60)).slice(-2);

  //const  {user}  = this.props.auth;

  let localstoragedata = JSON.parse(localStorage.getItem('userData'));
  let sessionData = localstoragedata.sessionData;
 
  let localDate = moment(sessionData.scheduleDate).format('MM/DD/YYYY # h:mm a');

  localDate = localDate.replace('#', 'at');
  let remTime = '';
  console.log('scheduleDate ',localDate );
  
  
  //console.log('------hhhhhhhh----users ', this.state.users)
 let users1 = this.state.users.map(user => {
    const { username, name, email } = user;
    return (
      <tr key={username}>
      <th scope="row"><img src="/images/avtar.png" /></th>
      <td>{name}</td>
      <td>{email}</td>
      <td><img className="mr-2" src="/images/online.png" />online</td>
      <td>YES</td>
      <td>5</td>
    </tr>
    );
  })


       // var allData= this.props.dispatch(allUsers(sessionId));
       var userlength=this.state.users;
       
       
      const newulength=Object.keys(userlength).length;

      // console.log('-----------Avishekhllllll-------------------', newulength)

      // const storeData = JSON.parse(localStorage.getItem("userData"));
      // console.log('-----------Avishekhllllll-------------------', storeData.sessionData.hostName)

return (

    <div>
      <div className="prescreen-popup modal fade" id="media-config" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

      <div className="modal-dialog modal-dialog-lg w-90" role="document">

        <div className="modal-content">

        <div className="modal-header">
        
          <div className="d-flex w-100 justify-content-between align-items-center">
            <div className="session-logo">
              <img src="/images/prescreen-logo.png" />
            </div>
            <div className="session-details bg-gray flex-grow-1 mx-2">
                <div className="row">
                  <div className="col-lg-9">
                    <h4 className="small-heading">Your Upcoming Session</h4>
                    <h3 className="popup-heading">{sessionData.name}<span>by {sessionData.hostName.toLowerCase()}</span><span className="green-online" id="online_state">ONLINE</span></h3>
                    <div className="time py-xs-1">  
                      <span className="no-border">{localDate}</span>
                    </div>
                  </div>
                  <div className="col-lg-3 float-right">
                    <span className="countdown-timer">{hours} : {minutes} : {seconds}</span>
                    <a href="#" className="btn btn-primary float-right">Session details</a>
                  </div>
                </div>
            </div>
            <div className="participant-status bg-gray">
              <h4 className="small-heading">Participants <img src="images/list-icon.png"  data-toggle="modal" data-target="#attendy-list" className="open-list" /></h4>
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
        
        <div className="modal-body bg-gray rounded my-2" id="media-content">
          
          <div className="row">
            <div className="col-12"><h6 className="small-heading mb-3">Select Video Camera</h6></div>
            <div className="col-12 video-streams select-camera" id="video-media-content"></div>
            
          </div>
        
        </div>
        <div className="d-flex w-100 justify-content-between">
          <div className="">
            <div className="bg-gray position-relative pad15 rounded">
              <h6 className="small-heading mb-3">Network Reliability</h6>
                <i class="fa fa-wifi fill-wifi" aria-hidden="true"></i>
              <div className="row">
                <div className="col-lg-4">
                  <span className="online-total">Online streams on screen</span>
                  
                </div>
                <div className="col-lg-4">
                  <span className="signup-number" >142</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray flex-grow-1 mx-2 position-relative pad15 rounded">
            <h6 className="small-heading mb-3">Select Microphone</h6>
            <div className="col-lg-12">
              <div className="row check-camera justify-content-around" id="audio-media-content"></div>
            </div>
          </div>
          <div className="bg-gray position-relative pad15 rounded max-w-170">
            <span className="online-total text-left">Heart Rate Monitor detected</span>
            <span className="signup-number font-20 text-left" >NO</span>
          </div>
        </div>
        

        <div className="modal-footer">
            {/* <div className="">
            <input type="checkbox" id="set-default" /><label htmlFor="set-default">Save as Default Setting</label>
            </div> */}
             
              <div className="col-lg-9">
              <span id='newmsg' style={{color:'green'}}></span>
                <h6 className="small-heading mb-3 no-border">Just joined</h6>
                <div className="">
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
              <div className="">
                <div className="d-flex justify-content-between flex-wrap">
                  <button type="submit" class="mr-2 btn-cancel btn btn-large btn-outline-secondary rounded py-2 px-4">Leave</button>
                  <button type="button" className="btn-join btn btn-large btn-primary text-uppercase py-2 px-4 rounded" id="continue-join">join</button>
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
              { users1 }                
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

export default connect()(Configuration);