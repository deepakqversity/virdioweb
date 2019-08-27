import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import $ from 'jquery';
import Config from "./Configuration";

class Host extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  joinOnClick = e => {
    e.preventDefault();
    let channel = document.getElementById('channel').value;
    this.props.joinConf(channel);
  };

  callfunction(){
    $('#logout_button').trigger('click');
  }

  sendMsgAll(){
    $('#msgToAll_button').trigger('click');
  }

  componentDidMount(){
  // console.log(2);    //
    if(localStorage.getItem('load-page') != 1){  
        window.loadPopup();
      localStorage.setItem("load-page", 1);
    }

    let sessionId = localStorage.getItem('sessionId');
    let localstoragedata = JSON.parse(localStorage.getItem('jwtToken'));

    fetch('/api/v1/session/'+sessionId, {headers : {'Authorization': localstoragedata.token}})
    .then(response => { return response.json(); })
    .then(data => {
      localStorage.setItem('currentSession', JSON.stringify(data));
        console.log('data=================', data);
        
    });
  }
  componentWillMount(){
    //console.log(1);
    // window.test();
  }
render() {
    const  {user}  = this.props.auth;

   // console.log(user);
    console.log('------------------------------', user);

return (
    <div className="container justify-content-between d-flex flex-column h-100 position-relative">
    <header className="header bg-gray mt-0 position-fixed">
      <div className="row d-block d-md-flex align-items-center">
        <div className="col-12 col-md-1">
          <a href="#" className="logo d-table mx-auto py-xs-1">
            <img src="images/logo.png" />
          </a>
        </div>
        <div className="col col-md-11">
          <h3 className="main-heading">A long title that can come here <span>by host name</span>
          <button className="position-absolute logout-btn" onClick={this.callfunction.bind(this)} tabIndex="1">
                <i className="fa fa-times" aria-hidden="true"></i>
          </button>
          </h3>
          <div className="row justify-content-between align-items-center mt-0">
            <div className="col-12 col-sm-7">
              <div className="time py-xs-1">  
                <span>04/23/2019, at 12:00 PM</span>
                <span>Time Remaining: 01:10:00</span>
                <div id ="all_attendies_list"></div>
              </div>
            </div>
            <div id="guestmsg" style={{color:'green'}}></div>
            <div className="col-12 col-sm-3">
              <div className="col-12 justify-content-end d-flex align-items-center">
<<<<<<< HEAD
                <a className="btn btn-primary border-right pr-20" href="javascript:;" tabIndex="0" id="fullscreen">fullscreen</a>
                <a className="btn btn-primary border-right pr-20" href="javascript:;"  onClick={this.sendMsgAll.bind(this)} tabIndex="1">details</a>
=======
                <a className="btn btn-primary border-right pr-20 mr-1" href="javascript:;" tabIndex="0" id="fullscreen">fullscreen</a>
                <a className="btn btn-primary border-right pr-20" href="javascript:;" tabIndex="1">details</a>
>>>>>>> 96533a8ed1e7fa1b5df1c7385b4612c6dcda35e0
                <img src="images/voice-commands.png" className="mic-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section className="bg-gray mt-1 px-0 py-1 rounded section attendees">
      <div className="row px-0 px-sm-3 pb-2 pt-0 justify-content-between align-items-center">
        <div className="col-6 col-md-6">
          <h4 className="title">Wine Testers (<span id="joined_users">0</span>/<span>44</span>)</h4>
        </div>
        <div className="col-6 col-md-4">
          <button type="button" className="btn btn-outline-secondary float-right mt-1 show-hide-footer-panel">"Show Attendees"</button>
        </div>
      </div>
      
    <div className="row one-gutters justify-content-center align-items-center" id="subscribers-list"></div>

    </section>
    <div className="row position-fixed host-script-section justify-content-between">
      <div className=" host-section d-flex flex-direction-column h-100">
        <div className="host-local">
          <div className="add-remove-round add-remove-height height-53 px-3 bg-gray pt-2 pb-2 top-rounded d-flex justify-content-between align-items-center">
            <h3 className="main-heading font-size-16 float-left">Streaming</h3>
            <div className="host-header">
              <img src="images/mute-microphone.png" className="unmute-icon" id="mute-unmute-local" />
              <img src="images/music-icon.png" className="music-icon" id="bg-music" />
              <img src="images/video-icon.png" className="video-icon d-none" id="publish" />
              <img src="images/video-close.png" className="video-icon" id="unpublish" />
              <img src="images/circle.png" className="circle-icon mr-0" id="record-stream" />
            </div>
          </div>
          <div className="add-remove-round host-show-hide px-3 bg-gray mt--1 pt-2 pb-1 bottom-rounded">
            <div id="agora_local" className="video-streams"></div>
          </div>
          
        </div>
      </div>
      
      <div className="test-script fitness-script h-100 ">
      
        <div className="overflow-hidden h-100">
          <div id="carouselExampleControls1" data-interval="false" className="carousel slide script-info h-100" data-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active h-100 justify-content-end flex-direction-column position-relative">
                <div className="bg-gray position-relative top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round ">
                  <h3 className="main-heading font-size-16">Fitness Script <span className="ml-md-4 font-size-16">3/22 activities</span></h3>
                  <button type="button" className="btn btn-outline-secondary mr-3 show-hide-script">"Hide Script"</button>
                  
                </div>
              
              <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
                <div className="max-h200">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="count-box">
                        <h4>Rest</h4>
                        <div id="countdown">
                          <div id="countdown-number"></div>
                          <svg>
                            <circle r="26" cx="30" cy="30"></circle>
                          </svg>
                          
                        </div>
                        <div className="row">
                          <div className="col-6 border-right ">
                            <div className="target-info">
                              <span>target zone</span>
                              <span>80%</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="target-info">
                              <span>target bpm</span>
                              <span>150</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="count-box focus-active">
                      <img src="images/screen-video.png" className="screen-video" />
                        <h4>Lunges</h4>
                        <div id="countdown">
                          <div id="countdown-number2"></div>
                          <svg>
                            <circle r="26" cx="30" cy="30"></circle>
                          </svg>
                        </div>
                        <div className="row">
                          <div className="col-6 border-right ">
                            <div className="target-info">
                              <span>target zone</span>
                              <span>80%</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="target-info">
                              <span>target bpm</span>
                              <span>150</span>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                      <p className="now-script">NOW</p>
                    </div>
                    <div className="col-md-4">
                      <div className="count-box">
                      <img src="images/screen-video.png" className="screen-video" />
                        <h4>Pushups</h4>
                        <div id="countdown">
                          <div id="countdown-number"></div>
                          <svg>
                            <circle r="26" cx="30" cy="30"></circle>
                          </svg>
                        </div>
                        <div className="row">
                          <div className="col-6 border-right ">
                            <div className="target-info">
                              <span>target zone</span>
                              <span>80%</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="target-info">
                              <span>target bpm</span>
                              <span>150</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> 
              </div>
              <a className="carousel-control-next position-relative btn btn-outline-secondary" href="#carouselExampleControls1" role="button" data-slide="next">
                    Next
                  </a>
            </div>
            <div className="carousel-item h-100 justify-content-end flex-direction-column position-relative">
                <div className="bg-gray position-relative top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round ">
                  <h3 className="main-heading font-size-16">Fitness Script <span className="ml-md-4 font-size-16">6/22 activities</span></h3>
                  <button type="button" className="btn btn-outline-secondary mr-3 show-hide-script">"Hide Script"</button>
                  
                </div>
              
              <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
                <div className="max-h200">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="count-box">
                        <h4>Rest</h4>
                        <div id="countdown">
                          <div id="countdown-number"></div>
                          <svg>
                            <circle r="26" cx="30" cy="30"></circle>
                          </svg>
                          
                        </div>
                        <div className="row">
                          <div className="col-6 border-right ">
                            <div className="target-info">
                              <span>target zone</span>
                              <span>80%</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="target-info">
                              <span>target bpm</span>
                              <span>150</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="count-box focus-active">
                      <img src="images/screen-video.png" className="screen-video" />
                        <h4>Lunges</h4>
                        <div id="countdown">
                          <div id="countdown-number2"></div>
                          <svg>
                            <circle r="26" cx="30" cy="30"></circle>
                          </svg>
                        </div>
                        <div className="row">
                          <div className="col-6 border-right ">
                            <div className="target-info">
                              <span>target zone</span>
                              <span>80%</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="target-info">
                              <span>target bpm</span>
                              <span>150</span>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                      <p className="now-script">NOW</p>
                    </div>
                    <div className="col-md-4">
                      <div className="count-box">
                      <img src="images/screen-video.png" className="screen-video" />
                        <h4>Pushups</h4>
                        <div id="countdown">
                          <div id="countdown-number"></div>
                          <svg>
                            <circle r="26" cx="30" cy="30"></circle>
                          </svg>
                        </div>
                        <div className="row">
                          <div className="col-6 border-right ">
                            <div className="target-info">
                              <span>target zone</span>
                              <span>80%</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="target-info">
                              <span>target bpm</span>
                              <span>150</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> 
              </div>
              <a className="carousel-control-next position-relative btn btn-outline-secondary" href="#carouselExampleControls1" role="button" data-slide="next">
                    Next
                  </a>
            </div>
            </div>
          </div>
          
        </div>
      </div>


      <div className="test-script h-100 d-none">
        <div className="overflow-hidden h-100">
          <div id="carouselExampleControls" data-interval="false" className="carousel slide carousel-fade script-info h-100" data-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active h-100 d-flex justify-content-end flex-direction-column">
                <div className="bg-gray position-relative top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round ">
                  <h3 className="main-heading font-size-16">Testing Script <span className="ml-md-4 font-size-16">1/4 wines</span></h3>
                  <button type="button" className="btn btn-outline-secondary mr-5 show-hide-script">"Hide Script"</button>
                  <a className="carousel-control-next position-relative" href="#carouselExampleControls" role="button" data-slide="next">
                    <img src="images/next-icon.png" className="next-btn" />
                  </a>
                </div>
              
              <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
                <div className="max-h200">
                  <h4 className="item-name">2014 Bliss Block Pinot Noir</h4>
                  <div className="row">
                    <ul className="col-12 col-md-12 col-lg-5 list-info">
                      <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                      <li><span>Year</span><span>2014​</span></li>
                      <li><span>Country</span><span>United States​</span></li>
                      <li><span>Appellation</span><span>Sonoma</span></li>
                      <li><span>Alcohol</span><span>14.3%</span></li> 
                    </ul>
                    <ul className="col-12 col-md-12 col-lg-7 list-info">
                      <li><span>pH</span><span>3.69</span></li>
                      <li><span>Aging</span><span>15 months in French Oak Barrels, 82%</span></li>
                      <li><span>Price</span><span>$80​</span></li>
                      <li><span>Case Production</span><span>250</span></li>
                    </ul>
                    <div className="col col-md-12">
                      <p className="item-text">The Bliss Block Pinot Noir beautifully captures the rich spice qualities that are characteristic of this cool pocket of our Quail Hill Estate vineyard. A bright garnet hue </p>
                    </div>
                  </div>
                </div> 
              </div>
            </div>
            <div className="carousel-item h-100 d-flex justify-content-end flex-direction-column">
                <div className="bg-gray top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round ">
                  <h3 className="main-heading font-size-16">Testing Script <span className="ml-md-4 font-size-16">2/4 wines</span></h3>
                  <button type="button" className="btn btn-outline-secondary mr-5 show-hide-script">"Hide Script"</button>
                  <a className="carousel-control-next position-relative" href="#carouselExampleControls" role="button" data-slide="next">
                    <img src="images/next-icon.png" className="next-btn" />
                  </a>
                </div>
              
              <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
                <div className="max-h200">
                  <h4 className="item-name">2014 Bliss Block Pinot Noir</h4>
                  <div className="row">
                    <ul className="col-12 col-md-12 col-lg-5 list-info">
                      <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                      <li><span>Year</span><span>2014​</span></li>
                      <li><span>Country</span><span>United States​</span></li>
                      <li><span>Appellation</span><span>Sonoma</span></li>
                      <li><span>Alcohol</span><span>14.3%</span></li> 
                    </ul>
                    <ul className="col-12 col-md-12 col-lg-7 list-info">
                      <li><span>pH</span><span>3.69</span></li>
                      <li><span>Aging</span><span>15 months in French Oak Barrels, 82%</span></li>
                      <li><span>Price</span><span>$80​</span></li>
                      <li><span>Case Production</span><span>250</span></li>
                    </ul>
                    <div className="col col-md-12">
                      <p className="item-text">The Bliss Block Pinot Noir beautifully captures the rich spice qualities that are characteristic of this cool pocket of our Quail Hill Estate vineyard. A bright garnet hue </p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            <div className="carousel-item h-100 d-flex justify-content-end flex-direction-column">
                <div className="bg-gray top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round ">
                  <h3 className="main-heading font-size-16">Testing Script <span className="ml-md-4 font-size-16">3/4 wines</span></h3>
                  <button type="button" className="btn btn-outline-secondary mr-5 show-hide-script">"Hide Script"</button>
                  <a className="carousel-control-next position-relative" href="#carouselExampleControls" role="button" data-slide="next">
                    <img src="images/next-icon.png" className="next-btn" />
                  </a>
                </div>
              
              <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
              <div className="max-h200">
                <h4 className="item-name">2014 Bliss Block Pinot Noir</h4>
                  <div className="row">
                    <ul className="col-12 col-md-12 col-lg-5 list-info">
                      <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                      <li><span>Year</span><span>2014​</span></li>
                      <li><span>Country</span><span>United States​</span></li>
                      <li><span>Appellation</span><span>Sonoma</span></li>
                      <li><span>Alcohol</span><span>14.3%</span></li> 
                    </ul>
                    <ul className="col-12 col-md-12 col-lg-7 list-info">
                      <li><span>pH</span><span>3.69</span></li>
                      <li><span>Aging</span><span>15 months in French Oak Barrels, 82%</span></li>
                      <li><span>Price</span><span>$80​</span></li>
                      <li><span>Case Production</span><span>250</span></li>
                    </ul>
                    <div className="col col-md-12">
                      <p className="item-text">The Bliss Block Pinot Noir beautifully captures the rich spice qualities that are characteristic of this cool pocket of our Quail Hill Estate vineyard. A bright garnet hue </p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            <div className="carousel-item h-100 d-flex justify-content-end flex-direction-column">
                <div className="bg-gray top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round ">
                  <h3 className="main-heading font-size-16">Testing Script <span className="ml-md-4 font-size-16">4/4 wines</span></h3>
                  <button type="button" className="btn btn-outline-secondary mr-5 show-hide-script">"Hide Script"</button>
                  <a className="carousel-control-next position-relative" href="#carouselExampleControls" role="button" data-slide="next">
                    <img src="images/next-icon.png" className="next-btn" />
                  </a>
                </div>
              
              <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
                <div className="max-h200">
                  <h4 className="item-name">2014 Bliss Block Pinot Noir</h4>
                  <div className="row">
                    <ul className="col-12 col-md-12 col-lg-5 list-info">
                      <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                      <li><span>Year</span><span>2014​</span></li>
                      <li><span>Country</span><span>United States​</span></li>
                      <li><span>Appellation</span><span>Sonoma</span></li>
                      <li><span>Alcohol</span><span>14.3%</span></li> 
                    </ul>
                    <ul className="col-12 col-md-12 col-lg-7 list-info">
                      <li><span>pH</span><span>3.69</span></li>
                      <li><span>Aging</span><span>15 months in French Oak Barrels, 82%</span></li>
                      <li><span>Price</span><span>$80​</span></li>
                      <li><span>Case Production</span><span>250</span></li>
                    </ul>
                    <div className="col col-md-12">
                      <p className="item-text">The Bliss Block Pinot Noir beautifully captures the rich spice qualities that are characteristic of this cool pocket of our Quail Hill Estate vineyard. A bright garnet hue </p>
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
    <div className="modal fade" id="guest-video" role="dialog">
    <div className="modal-dialog modal-lg bg-black px-4 m-0 mw-100 h-100 d-flex w-100 align-items-center">
      <div className="h-100 modal-content bg-transparent w-100 d-flex justify-content-between flex-direction-column">
        <div>
          <button type="button" className="close-model-btn close float-left" data-dismiss="modal">&times;</button>
          <a href="#" className="eject-this">Eject from Session <img src="images/eject.png" /></a>
        </div>
        <div className="modal-content clone-guest-video" id="clone-guest-video"></div>
        <div className="guest-video-footer">
          <div className="conversations">
            <a href="#"><img src="images/private-conversation.png" />Public Conversation</a>
            <a href="#"><img src="images/private-conversation.png" />Private Conversation</a>
            <a href="#" className="float-right mr-0">Emotions <img className="ml-3" src="images/quote-circular-button.png" /></a>
          </div>
          
      </div>
    </div>
      
    </div>
  </div>
      <div className="modal fade" id="hand-raise" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

      <div className="modal-dialog modal-dialog-lg" role="document">

        <div className="modal-content">

        <div className="modal-header">

          <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>

          <button type="button" className="close" data-dismiss="modal" aria-label="Close">

          <span aria-hidden="true">&times;</span>

          </button>

        </div>

        <div className="modal-body" id="active-single-user">

        </div>

        <div className="modal-footer">

           <button type="button" className="btn btn-primary">Button</button>

        </div>

        </div>

      </div>


      </div>

      <input type="hidden" id="conf-page" />
      <Config />
  </div>
    );
  }
}
Host.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Host);