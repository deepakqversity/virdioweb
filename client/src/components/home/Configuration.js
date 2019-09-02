import React, { Component } from "react";
//import header from '../../config.js';
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import  UserApi from "../../actions/userApi.js";
import { allUsers } from "../../actions/authActions";
import $ from 'jquery';
class Configuration extends Component {
  
  constructor(props) {
    super(props);
   // this.state = {data : '', allData:''}

   this. state = {
      isLoading: true,
      users: [],
      error: null
    }
  }

  componentDidMount(){
  this.fetchUsers();
  }
  componentWillMount(){
    //console.log(1);
    // window.test();
  }



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

       console.log('-----------Avishekhllllll-------------------', newulength)

return (

    <div>
           <div className="modal fade" id="media-config" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

      <div className="modal-dialog modal-dialog-lg mw-75" role="document">

        <div className="modal-content">

        <div className="modal-header">

          <h5 className="modal-title" id="exampleModalLabel">Media Configuration</h5>
          <span>Total Signup:</span><span id="totalsignup">{newulength}</span>
         <span>Online:</span><span id="totalonline"></span>
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
        <span id='newmsg' style={{color:'green'}}></span>
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
            <table class="table">
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