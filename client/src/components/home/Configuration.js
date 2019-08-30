import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from 'jquery';
class Configuration extends Component {
  
 
  componentDidMount(){
  // console.log(2);    //
  }
  componentWillMount(){
    //console.log(1);
    // window.test();
  }
render() {

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
                    <h3 className="popup-heading">An introduction to wine tasting <span>by Arjun Rishi</span><span className="online-status green-online ">ONLINE</span></h3>
                    <div className="time py-xs-1">  
                      <span className="no-border">04/23/2019, at 12:00 PM</span>
                    </div>
                  </div>
                  <div className="col-lg-3 float-right">
                    <span className="countdown-timer">00:23:43</span>
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
                      <span className="signup-number" id="totalsignup">142</span>
                    </div>
                    <div className="col-lg-6">
                      <span className="online-total">Online</span>
                      <span className="online-number" id="totalonline">33</span>
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
            
              <div className="col-lg-">
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
                  <th scope="col">Location</th>
                  <th scope="col">Status</th>
                  <th scope="col">Visible</th>
                  <th scope="col"># of Sessions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row"><img src="/images/avtar.png" /></th>
                  <td>Mark</td>
                  <td>San Francisco, California</td>
                  <td><img className="mr-2" src="/images/online.png" />online</td>
                  <td>YES</td>
                  <td>5</td>
                </tr>
                <tr>
                <th scope="row"><img src="/images/avtar.png" /></th>
                  <td>Mark</td>
                  <td>San Francisco, California</td>
                  <td><img className="mr-2" src="/images/offline.png" />offline</td>
                  <td>YES</td>
                  <td>5</td>
                </tr>
                <tr>
                <th scope="row"><img src="/images/avtar.png" /></th>
                  <td>Mark</td>
                  <td>San Francisco, California</td>
                  <td><img className="mr-2" src="/images/unknown.png" />Unknown</td>
                  <td>YES</td>
                  <td>5</td>
                </tr>
                <tr>
                <th scope="row"><img src="/images/avtar.png" /></th>
                  <td>Mark</td>
                  <td>San Francisco, California</td>
                  <td><img className="mr-2" src="/images/offline.png" />offline</td>
                  <td>YES</td>
                  <td>5</td>
                </tr>
                <tr>
                <th scope="row"><img src="/images/avtar.png" /></th>
                  <td>Mark</td>
                  <td>San Francisco, California</td>
                  <td><img className="mr-2" src="/images/unknown.png" />Unknown</td>
                  <td>YES</td>
                  <td>5</td>
                </tr>
                <tr>
                <th scope="row"><img src="/images/avtar.png" /></th>
                  <td>Mark</td>
                  <td>San Francisco, California</td>
                  <td><img className="mr-2" src="/images/offline.png" />offline</td>
                  <td>YES</td>
                  <td>5</td>
                </tr>
                <tr>
                <th scope="row"><img src="/images/avtar.png" /></th>
                  <td>Mark</td>
                  <td>San Francisco, California</td>
                  <td><img className="mr-2" src="/images/unknown.png" />Unknown</td>
                  <td>YES</td>
                  <td>5</td>
                </tr>
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