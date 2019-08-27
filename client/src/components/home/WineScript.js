import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class WineScript extends Component {
  
 
  componentDidMount(){
  // console.log(2);    //
  }
  componentWillMount(){
    //console.log(1);
    // window.test();
  }
render() {

return (
    
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
    );
  }
}

export default connect()(WineScript);