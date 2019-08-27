import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class FitnessScript extends Component {
  
 
  componentDidMount(){
  // console.log(2);    //
  }
  componentWillMount(){
    //console.log(1);
    // window.test();
  }
render() {

return (
    
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
    );
  }
}

export default connect()(FitnessScript);