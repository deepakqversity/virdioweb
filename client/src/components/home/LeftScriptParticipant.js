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

  let localstoragedata = JSON.parse(localStorage.getItem('userData'));

  let sessionData = localstoragedata.sessionData;

  let sessionScript = localstoragedata.sessionData.scriptDetail;
  console.log('sessionScript=', sessionScript)

return (
      <div className="col-lg-4 col-md-6 col-sm-6 col-6 max-width-300">
      { this.props.sessId == 1 ? (

        
      <div className="">
        <div id="demo" data-interval="false" className="carousel slide script-info" data-ride="carousel">

          <div className="carousel-inner guest-left-wine">

{
  sessionScript.map((opt, i) =>
            <div className="carousel-item" key={i}>
            <div className="left-section">
            <h2 className="item-name text-right"><span className="ml-md-4 font-size-16 "><span className="fitness-counter1">{i+1}</span>/{sessionScript.length} {sessionData.scriptType}</span></h2>
                {/* <h2 className="item-name py-3">{sessionData.scriptTitle}  {sessionData.scriptType}</h2> */}
                <h3 className="second-heading my-2">{opt.name}</h3>
                <div className="video-holder">
                  <img src="images/Rectangle.png" />
                </div>
                
                <div className="item-description py-4">
                  <div className="row">
                    <ul className="col-12 col-md-12 list-info my-0">
                            {opt.attribute.map(function(attrb, inf){
                             return <li key={inf}><span>{attrb.attrLabel}</span><span>{attrb.attrValue}</span></li>   
                            })}
                                      
                    </ul>
                  
                    
                  </div>
                </div>
                
              </div>
            </div>

          )}
                    
          </div>
          <button type="button" data-toggle="modal" data-target="#show-details4" className="mt-4 btn btn-outline-secondary show-details-btn">"Show Details"</button>
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
        <div className="left-section mt-3 ml-4">
          <div className="bpm-bar">
            <span className="pop-text">Your BPM</span>
            <div className="readings">
              <span>20</span><span>40</span><span>60</span><span>80</span><span>100</span><span>120</span><span>140</span>
              <span>160</span><span className="target-read"><span className="target-label">TARGET</span>180</span><span>200</span><span>220</span>
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