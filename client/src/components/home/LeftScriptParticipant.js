import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class LeftScriptParticipant extends Component {
  
 
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
      { this.props.sessId == 1 ? (

        
      <div className="col-lg-6 col-md-6 col-sm-9 col-12 max-width-300">
        <div id="demo" data-interval="false" className="carousel slide" data-ride="carousel">

          <div className="carousel-inner">
            <div className="carousel-item active">
            <div className="left-section">
                <h2 className="item-name py-3">1/4 Wines</h2>
                <h3 className="second-heading my-3">2014 Bliss Block Pinot Noir</h3>
                <div className="video-holder">
                  <img src="images/Rectangle.png" />
                </div>
                
                <div className="item-description py-4">
                  <div className="row">
                    <ul className="col-12 col-md-12 list-info my-0">
                      <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                      <li><span>Year</span><span>2014​</span></li>
                      <li><span>Country</span><span>United States​</span></li>
                      <li><span>Appellation</span><span>Sonoma</span></li>
                    
                    </ul>
                  
                    
                  </div>
                </div>
                <button type="button" data-toggle="modal" data-target="#show-details" className="btn btn-outline-secondary show-details-btn">"Show Details"</button>
              </div>
            </div>
            <div className="carousel-item">
            <div className="left-section">
                <h2 className="item-name py-3">1/4 Wines</h2>
                <h3 className="second-heading my-3">2014 Bliss Block Pinot Noir</h3>
                <div className="video-holder">
                  <img src="images/Rectangle.png" />
                </div>
                
                <div className="item-description py-4">
                  <div className="row">
                    <ul className="col-12 col-md-12 list-info my-0">
                      <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                      <li><span>Year</span><span>2014​</span></li>
                      <li><span>Country</span><span>United States​</span></li>
                      <li><span>Appellation</span><span>Sonoma</span></li>
                    
                    </ul>
                  
                    
                  </div>
                </div>
                <button type="button" data-toggle="modal" data-target="#show-details" className="btn btn-outline-secondary show-details-btn">"Show Details"</button>
              </div>
            </div>
            <div className="carousel-item">
            <div className="left-section">
                <h2 className="item-name py-3">1/4 Wines</h2>
                <h3 className="second-heading my-3">2014 Bliss Block Pinot Noir</h3>
                <div className="video-holder">
                  <img src="images/Rectangle.png" />
                </div>
                
                <div className="item-description py-4">
                  <div className="row">
                    <ul className="col-12 col-md-12 list-info my-0">
                      <li><span>Varietal</span><span>100% Pinot Noir</span></li>
                      <li><span>Year</span><span>2014​</span></li>
                      <li><span>Country</span><span>United States​</span></li>
                      <li><span>Appellation</span><span>Sonoma</span></li>
                    
                    </ul>
                  
                    
                  </div>
                </div>
                <button type="button" data-toggle="modal" data-target="#show-details" className="btn btn-outline-secondary show-details-btn">"Show Details"</button>
              </div>
            </div>
          </div>

          <a className="carousel-control-prev d-none" href="#demo" data-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </a>
          <a className="carousel-control-next d-none" href="#demo" data-slide="next">
            <span className="carousel-control-next-icon"></span>
          </a>
          </div>
        
        
      </div>
    ) : (
      this.props.sessId == 2 ? (
      <div className="h-100 col-lg-1 col-md-1 col-sm-1 col-1 max-width-300 d-flex">
        <div className="left-section mt-3">
          <div className="bpm-bar">
            <span className="pop-text">Your BPM</span>
            <div className="readings">
              <span>20</span><span>40</span><span>60</span><span>80</span><span>100</span><span>120</span><span>140</span>
              <span>160</span><span className="target-read">180</span><span>200</span><span>220</span>
            </div>
            <div className="skills bpm">153</div>
          </div>
        </div>
      </div>
        ) : ( <div> </div> )
      )
    }
    </div>
      
    );
  }
}

export default connect()(LeftScriptParticipant);