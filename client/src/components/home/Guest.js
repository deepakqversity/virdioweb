import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import $ from 'jquery';
import Config from "./Configuration";
import LeftScriptParticipant from "./LeftScriptParticipant";
import FooterScriptParticipant from "./FooterScriptParticipant";

class Guest extends Component {

  constructor(props) {
    super(props);
    this.state = {getID : ''}
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
    
  };
  

  // joinOnClick = e => {
  //   e.preventDefault();
  //   let channel = document.getElementById('channel').value;
  //   this.props.joinConf(channel);
  // };

  callfunction(){
    $('#logout_button').trigger('click');
  }
  

  handRaise(){
    // var ID=this.state.getID;
    // console.log(ID);
    $('#handRaiseClient_button').trigger('click');
  }

  getAppearence(){
    var ID=this.state.getID;
    console.log(ID);
    $("#appearence_button").val(ID);
    $('#appearence_button').trigger('click');
  }

  getAroma(){
    var ID=this.state.getID;
    console.log(ID);
    $("#aroma_button").val(ID);
    $('#aroma_button').trigger('click');
  }
  getPalate(){
    var ID=this.state.getID;
    console.log(ID);
    $("#palate_button").val(ID);
    $('#palate_button').trigger('click');
  }
  getScore(){
    var ID=this.state.getID;
    console.log(ID);
    $("#score_button").val(ID);
    $('#score_button').trigger('click');
  }
  
  loadScript = function (src) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    
    var body = document.getElementsByTagName('html')[0];
    body.appendChild(tag);
  }

  componentDidMount(){
    
    this.loadScript('/AgoraRTCSDK-2.7.1.js');
    this.loadScript('/agora-rtm-sdk-1.0.0.js');
    this.loadScript('/main.js');

    // if(localStorage.getItem('load-page') != 1){  
    //     window.loadPopup();
    //   localStorage.setItem("load-page", 1);
    // }
    
    let localstoragedata = JSON.parse(localStorage.getItem('userData'));

    var  userID=localstoragedata.id;
    this.setState({getID : userID});

    // var loadScript = function (src) {
    //   var tag = document.createElement('script');
    //   tag.async = false;
    //   tag.src = src;
      
    //   var body = document.getElementsByTagName('body')[0];
    //   body.appendChild(tag);
    // }
    // loadScript('/js/swiper.min.js');
    // loadScript('/js/swiper-modifier.js');

    
  }
  
  componentWillMount(){
    //console.log(1);
    // window.test();
  }
render() {
  const  {user}  = this.props.auth;

  // console.log(user);

  var userData = JSON.parse(localStorage.getItem("userData"));
  var userID = userData.id;

return (
    <div className="container d-flex flex-column justify-content-between h-100 overlay position-relative">

      <div id="agora_host" className="fix-host"></div>
      
  <header className="header w-100 p-0">
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="transparent-gray">
            <div className="row">
              <a href="" className="col-12 py-xs-1 col-lg-1 col-md-1 col-sm-1 d-flex v-logo align-items-center">
                <img src="images/v-logo.png" />
              </a>
              <div className="col-12 col-lg-11 col-md-11 col-sm-11">
              
                <div className="row justify-content-between align-items-center">
                  <div className="col-12 col-lg-7 col-md-6 text-center text-md-left col-sm-4">
                    <div className="time py-xs-1">  <span>04/23/2019, at 12:00 PM</span>
                      <span>Time Remaining: 01:10:00</span>
                    </div>
                    <div id="hostmsg" style={{color:'green'}}></div>
                  </div>
                  
                  <div className="col-12 center-mob col-sm-7 col-md-6 col-lg-3 d-flex justify-content-end">
                  
                    <a className="col-2 justify-content-end d-flex align-items-center" href="#" className="btn btn-primary " tabIndex="1">Details</a>
                    <div className="default-btns mr-2">
                      <a href="#" className="btn btn-primary ml-2" id="mocrophone-off" onClick={this.handRaise.bind(this)} alt="Microphone" title="Microphone Off"><img src="images/hand.png" /></a>
                      <a href="#" className="btn btn-primary ml-2 d-none" id="mocrophone-on" alt="Microphone" title="Microphone On"><i className="fa fa-microphone"></i></a>
                    </div>

                      <a className="col-2 justify-content-end d-flex align-items-center" href="#" className="btn btn-primary " tabIndex="1">Details</a>
                      <a href="#" className="btn btn-primary ml-2" id="strm-publish" alt="Broadcaster" title="Broadcaster"><i className="fa fa-user-plus"></i></a>
                      <a href="#" className="btn btn-primary ml-2 d-none" id="strm-unpublish" alt="Audience" title="Audience"><i className="fa fa-user-times"></i></a>

                      {/* <button className="btn btn-primary ml-2" onClick={this.onLogoutClick} tabIndex="1"><i className="fa fa-power-off"></i></button> */}
                      <button className="ml-2 logout-btn" onClick={this.callfunction.bind(this)} tabIndex="1">
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
                  
        </div>
        
      </div>
      
    </header>
    
    <div className="d-flex justify-content-between zindex-5 position-relative flex-grow-1 attend-mid-section">
    
    <LeftScriptParticipant sessId={userData.sessionData.id} />
    
    <div className="col-lg-3 col-md-4 col-sm-5 col-6 max-width-300 float-right pl-0 mt-3">
        <div className="right-sidebar">
          <div className="transparent-gray slide-right-left" style={toggleList}>
            
            <div className="joined-attendees ">
            <h4 className="mb-2 head"><span className="title">Wine Testers</span><span className="count">(<span  id="joined_users_at_client">0</span>/<span>44</span>)</span></h4>
            <div id="all_joined_member_list"></div>
            <button type="button" id="minimize-others" className="mt-2 minimize-others btn btn-outline-secondary mx-auto d-none">"Minimize Others"</button>
        
            </div>
           
            <div className="self-video mt-3">
              
            </div>
          
          </div>
          
          
        </div>
      
    </div>
  </div>
    <footer className="footer position-relative zindex-5 count-box mb-5 mt-4">
      
      <FooterScriptParticipant sessId={userData.sessionData.id} />

      <div className="self-video1 mt-3 w-50">
          <button type="button" id="show-everyone" className="mb-2 minimize-others btn btn-outline-secondary mx-auto">"Show Everyone"</button>
          
          <div id="agora_local" className="video-streams guest-video" style={videoAspect}></div>
          
      </div>
    </footer>
    
  
    
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
    <Config />

  </div>
    );
  }
}
const toggleList = {
  width: '72px',
  float: 'right'
}
const videoAspect = {
  width: "220px",
  height: "124px",
  float: "right"
}
Guest.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Guest);