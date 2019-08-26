import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, joinConf} from "../../actions/authActions";
import $ from 'jquery';
// import { joinConf } from "../../actions/authActions";
class Home extends Component {

  constructor(props){

    super(props);
    this.state = {
            sessions: [],
        };
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();

  };
  componentDidMount(){

    let localstoragedata=JSON.parse(localStorage.getItem('jwtToken'));

    let initialSessions = [];
    fetch('/api/v1/session', {headers : {'Authorization': localstoragedata.token}})
        .then(response => {
            return response.json();
        }).then(data => {
        initialSessions = data.map((session) => {
            return session
        });
        console.log('****',initialSessions);
        this.setState({
            sessions: initialSessions,
        });
    });

  }

  joinOnClick = e => {
    let sessionId = document.getElementById('sessionId').value;
    e.preventDefault();

    // localStorage.setItem("channel", channel);
    localStorage.setItem("sessionId", sessionId);

    let localstoragedata = JSON.parse(localStorage.getItem('jwtToken'));

    localStorage.setItem("load-page", 0);

    if(localstoragedata.userType == 1){
      // return <Redirect to="/host" />;
      this.props.history.push("/host");
     }else{
      // return <Redirect to="/guest" />;
      this.props.history.push("/guest");
     }
  };
render() {
    const  {user}  = this.props.auth;

    const sessions = this.state.sessions;
    const optionItems = sessions.map((opt, i) =>
              <option value={opt.id} key={i}>{opt.channelName} ({opt.type == 1 ? 'Host' : 'Guest'})</option>
          );

    // console.log('$$$$',optionItems);
   
   var retrievedObject = localStorage.getItem('jwtToken');
   var localstoragedata=JSON.parse(retrievedObject);
return (
      <div className="container mt-5 valign-wrapper">
      <div className="row">
      <div className="text-white col-md-4 mx-auto d-table">
        <h4><b>Hey,</b> {localstoragedata.name} <button onClick={this.onLogoutClick}
              className="btn btn-danger float-right">
              <i className="fa fa-power-off"></i>
            </button></h4>
        
        <h5 style={{ marginTop:"50px" }}>To join conference please select channel</h5>
        
        <div>
          <select name="sessionId" id="sessionId" className="form-control" style={{ display:"inline-block" }} >
          {optionItems}
          </select>
        </div>
        <div><button type="button" className="mx-auto d-table mt-4 btn btn-primary" onClick={this.joinOnClick}>Join</button></div>
      
      </div>
      
      
          
        </div>
      </div>
    );
  }
}
Home.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  joinConf: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser, joinConf }
)(Home);