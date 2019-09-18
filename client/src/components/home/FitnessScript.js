import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from 'jquery';

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
  
  fitnessScriptStart(){  
    $('#ftnsStart').trigger('click');
  }

  fitnessScriptStop(){  
    $('#ftnsStop').trigger('click');
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
let sessionScript = localstoragedata.sessionData.scriptDetail;
console.log('sessionScript=', sessionScript)
return (
    
      <div className="test-script fitness-script h-100 ">
      
        <div className="overflow-hidden h-100">
          <div id="" className=" script-info h-100">
            <div className="h-100">
              
            <div className="d-flex height-script h-100 justify-content-end flex-direction-column position-relative">
                <div className="animate-display bg-gray position-relative top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round ">
                  <h3 className="main-heading font-size-16">Fitness Script <span className="ml-md-4 font-size-16">6/22 activities</span></h3>
                  <button type="button" className="btn btn-outline-secondary mr-3 show-hide-script">"Hide Script"</button>
                  
                </div>
              
              <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
                <div className="h-100">
                  <div className="row">
                  <div className="swiper-container">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide start">
                          <span>
                            <a href="#" id="hostFtnsScript" onClick={this.fitnessScriptStart.bind(this)}>Start</a>
                          </span>
                        </div>
                      {
                        sessionScript.map((opt, i) =>
                          <div className="swiper-slide" key={i}>
                          <div>
                            <div className="count-box">
                              <h4>{opt.name}</h4>
  
                              <div className="countdown">
                                {opt.attribute.map(function(attrb, index){
                                  if(attrb.attrLabel == 'counter'){
                                  return <div className="countdown-number" key={index}>{attrb.attrValue} SEC</div>;
                                  }
                                })}

                                <svg>
                                  <circle r="26" cx="30" cy="30"></circle>
                                </svg>
                                
                              </div>
                              <div className="row fitness-info justify-content-center">
                                
                                {opt.attribute.map(function(attrb, index){
                                  if(attrb.attrLabel != 'counter'){
                                  return <div className=" " key={index}>
                                    <div className="target-info">
                                      <span>{attrb.attrLabel}</span>
                                      <span>{attrb.attrValue}</span>
                                    </div>
                                  </div>;
                                }
                                })}
                                
                              </div>
                            </div>
                          </div>
                        </div>

                        )}
                        <div className="swiper-slide end">
                          <span>
                            <h4>End of Script</h4>
                            <img src="images/end-script.png" />
                            <a href="#" className="btn btn-primary mx-auto d-table" onClick={this.fitnessScriptStop.bind(this)}>End Session</a>
                          </span>
                        </div>
                      </div>
                      
                      {/* <div className="swiper-pagination"></div> */}
                      <div className="swiper-btns">
                        <a href="#" className="btn btn-outline-secondary swiper-btn-next">"Next"</a>
                        <a href="#" className="btn btn-outline-secondary swiper-btn-prev d-none">"Prev"</a>
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
    );
  }
}

export default connect()(FitnessScript);