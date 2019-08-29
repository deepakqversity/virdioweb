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

          <div className="d-flex w-100 justify-content-between">
            <div className="session-logo">
              <img src="/images/prescreen-logo.png" />
            </div>
            <div className="session-details bg-gray flex-grow-1 mx-2">
                <h4 className="small-heading">Your Upcoming Session</h4>
                <h3 className="popup-heading">An introduction to wine tasting <span>by Arjun Rishi</span></h3>
                <div class="time py-xs-1">  
                  <span>04/23/2019, at 12:00 PM</span>
                </div>
                <div className="col-lg-2 float-right">
                  <span className="countdown-timer">00:23:43</span>
                  <a href="#" className="btn btn-primary">Session details</a>
                </div>
            </div>
            <div className="participant-status bg-gray">
              <h4 className="small-heading">Participants <img src="images/list-icon.png" className="open-list" /></h4>
                <span>Total Signup:</span><span id="totalsignup"></span>
                <span>Online:</span><span id="totalonline"></span>
            </div>
          </div>
          
          

        </div>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#attendy-list">
            Open modal
          </button>
        <div className="modal-body" id="media-content">
          
          <div className="row">
            <div className="col-12"><h6>Choose Camera</h6></div>
            <div className="col-12 video-streams" id="video-media-content"></div>
            <div className="col-12"><h6>Chosse Mocrophone</h6></div>
            <div className="col-12" id="audio-media-content"></div>
          </div>
        
        </div>

        <div className="modal-footer">
            <div className="">
            <input type="checkbox" id="set-default" /><label htmlFor="set-default">Save as Default Setting</label>
            </div>
           <button type="button" className="btn btn-primary" id="continue-join">Continue...</button>

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