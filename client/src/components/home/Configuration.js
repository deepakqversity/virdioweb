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
      <div className="modal fade" id="media-config" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

      <div className="modal-dialog modal-dialog-lg mw-75" role="document">

        <div className="modal-content">

        <div className="modal-header">

          <h5 className="modal-title" id="exampleModalLabel">Media Configuration</h5>
          <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#attendy-list">
            Open modal
          </button>
          

        </div>

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