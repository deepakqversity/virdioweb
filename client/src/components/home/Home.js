import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, joinConf} from "../../actions/authActions";
// import { joinConf } from "../../actions/authActions";
class Home extends Component {

  constructor(props){

    super(props);
    this.state = {
            channels: [],
        };
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();

  };
  componentDidMount(){

    let retrievedObject = localStorage.getItem('jwtToken');
    let localstoragedata=JSON.parse(retrievedObject);

    let initialChannels = [];
    fetch('/api/v1/conference/channels', {headers : {'Authorization': localstoragedata.token}})
        .then(response => {
            return response.json();
        }).then(data => {
        initialChannels = data.map((channel) => {
            return channel
        });
        console.log('****',initialChannels);
        this.setState({
            channels: initialChannels,
        });
    });

    // axios
    // .get("/api/v1/conference/channels", {headers : {'Authorization': localstoragedata.token}} )
    // .then(res => {
    //     console.log(' channle ', res.data)
    //     let data = res.data;
    //     let teamsFromApi = data.map(team => { return {value: team._id, display: team.channel} })
    //       this.setState({ teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });


    // }) // re-direct to login on successful register
    // .catch(err =>
    //   {
        
    //   }
    // );

  }

  joinOnClick = e => {
    let channel = document.getElementById('channel').value;
    e.preventDefault();
    console.log(this.props)
    this.props.joinConf(channel);
  };
render() {
    const  {user}  = this.props.auth;

    const channels = this.state.channels;
    const optionItems = channels.map((opt) =>
                <option value={opt.channel}>{opt.channel}</option>
            );

     console.log('$$$$----------------lalit',optionItems);
   
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
          <select name="channel" id="channel" className="form-control" style={{ display:"inline-block" }} >
          {optionItems}
          </select>
        </div>
        <div><button type="button" className="mx-auto d-table mt-4 btn btn-primary" id="join" onClick={this.joinOnClick}>Join</button></div>
      
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