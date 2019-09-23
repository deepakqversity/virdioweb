import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from 'jquery';

class WineScript extends Component {
  
 
  componentDidMount(){
  // console.log(2);    //
  }
  componentWillMount(){
    //console.log(1);
    // window.test();
  }

  getNext(){  
    $('#wineNext_button').trigger('click');
  }

  getPrev(){  
    $('#winePrev_button').trigger('click');
  }
  
render() {

  let localstoragedata = JSON.parse(localStorage.getItem('userData'));

  let sessionData = localstoragedata.sessionData;

  let sessionScript = localstoragedata.sessionData.scriptDetail;
  console.log('sessionScript=', sessionScript)

return (
    
      <div className="test-script  h-100">
        <div className="overflow-hidden h-100">
          <div id="carouselExampleControls" data-interval="false" className="carousel slide carousel-fade script-info h-100" data-ride="carousel">
            <div className="carousel-inner h-100">
              <div className="height-script h-100">
{
  sessionScript.map((opt, i) =>
            <div className="carousel-item  h-100 d-flex justify-content-end flex-direction-column" key={i}>
                <div className="bg-gray position-relative top-rounded d-md-flex justify-content-between align-items-center px-3 py-3 add-remove-round">
                  <h3 className="main-heading font-size-16">{sessionData.scriptTitle} <span className="ml-md-4 font-size-16 "><span className="fitness-counter1">{i+1}</span>/{sessionScript.length} {sessionData.scriptType}</span></h3>
                  <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev" onClick={this.getPrev.bind(this)} >
                    <img src="images/prev-icon.png" className="next-btn" />
                  </a>
                  <a href="#" className=" mr-5 show-hide-script"><img src="images/showscript.png" /></a>
                  <a className="carousel-control-next position-relative" href="#carouselExampleControls" role="button" data-slide="next" id="winscript"  onClick={this.getNext.bind(this)}>
                    <img src="images/next-icon.png" className="next-btn" />
                  </a>
                </div>
                       
                        <div className="bg-gray bottom-rounded px-3 pb-2 item-description script-section mt--1 flex-grow-1">
                        <div className="max-h200">
                          <h4 className="item-name">{opt.name}</h4>
                          <div className="row">
                         
                            <ul className="col-12 col-md-12 col-lg-5 list-info">
                            {opt.attribute.map(function(attrb, index){
                             return <li key={index}><span>{attrb.attrLabel}</span><span>{attrb.attrValue}</span></li>   
                            })}
                            </ul>
                         
                         
                            <div className="col col-md-12">
                              <p className="item-text">The Bliss Block Pinot Noir beautifully captures the rich spice qualities that are characteristic of this cool pocket of our Quail Hill Estate vineyard. A bright garnet hue </p>
                            </div>


                          </div>
                        </div> 
                      </div>

            </div>
            )}
            
            </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default connect()(WineScript);