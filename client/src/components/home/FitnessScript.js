import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class FitnessScript extends Component {
  
 
  componentDidMount(){
    var loadScript = function (src) {
      var tag = document.createElement('script');
      tag.async = false;
      tag.src = src;
      
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(tag);
    }
    loadScript('/js/swiper.min.js');
    loadScript('/js/swiper-modifier.js');
  }
  
  componentWillMount(){
    //console.log(1);
    // window.test();
  }

  createProduct = () => {
    let prodHtml = []

      // Outer loop to create parent
      for (let i = 0; i < 3; i++) {
        let children = []
        //Inner loop to create children
        for (let j = 0; j < 5; j++) {
          children.push(<td>Test</td>)
        }
        //Create the parent and add the children
        prodHtml.push(<tr>{children}</tr>)
      }
      return prodHtml
    }

render() {

let localstoragedata = JSON.parse(localStorage.getItem('userData'));
let products = localstoragedata.sessionData.productDetail;
console.log('products=', products)
return (
    
      <div className="test-script fitness-script h-100 ">
      
        <div className="overflow-hidden h-100">
          <div id="" className=" script-info h-100">
            <div className="h-100">
              {/* <div className="carousel-item active h-100 justify-content-end flex-direction-column position-relative">
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
            </div> */}
            <div className="height-script h-100 justify-content-end flex-direction-column position-relative">
                <div className="bg-gray position-relative top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round ">
                  <h3 className="main-heading font-size-16">Fitness Script <span className="ml-md-4 font-size-16">6/22 activities</span></h3>
                  <button type="button" className="btn btn-outline-secondary mr-3 show-hide-script">"Hide Script"</button>
                  
                </div>
              
              <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
                <div className="h-100">
                  <div className="row">
                  <div class="swiper-container">
                      <div class="swiper-wrapper">
                      {
                        products.map((opt, i) =>
                          <div className="swiper-slide" key={i}>
                          <div class="">
                            <div className="count-box">
                              <h4>{opt.name}</h4>

                              <div className="countdown">
                                <div className="countdown-number">30 SEC</div>
                                <svg>
                                  <circle r="26" cx="30" cy="30"></circle>
                                </svg>
                                
                              </div>
                              <div className="row justify-content-center">
                                
                                {opt.attribute.map(function(attrb, index){
                                  return <div className="border-right ">
                                  <div className="target-info">
                                    <span>{attrb.attrLabel}</span>
                                    <span>{attrb.attrValue}</span>
                                  </div>
                                </div>;
                                })}
                                
                              </div>
                            </div>
                          </div>
                        </div>

                        )}
                      </div>
                      
                      <div class="swiper-pagination"></div>
                    </div>
                    
                  </div>
                </div> 
              </div>
              
            </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default connect()(FitnessScript);