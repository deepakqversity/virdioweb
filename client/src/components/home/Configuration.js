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
    
      <div className="modal fade" id="media-config" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

      <div className="modal-dialog modal-dialog-lg mw-75" role="document">

        <div className="modal-content">

        <div className="modal-header">

           <h5 className="modal-title" id="exampleModalLabel">Media Configuration</h5> 
         <span>Total Signup:</span><span id="totalsignup"></span>
         <span>Online:</span><span id="totalonline"></span>
         <button  id="user_list" class ="mx-auto d-table mt-4 btn btn-primary">UserList</button>
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
    );
  }
}

export default connect()(Configuration);