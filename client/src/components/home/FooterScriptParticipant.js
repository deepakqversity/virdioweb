import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from 'jquery';

class FooterScriptParticipant extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      getID : '',
      getEmail : ''
    };
  }
 
  componentDidMount(){
    
    

    let localstoragedata = JSON.parse(localStorage.getItem('userData'));
    var userEmail=localstoragedata.email;
    var  userID=localstoragedata.id;
    this.setState({getEmail : userEmail});
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

  getAppearence(){  
    let Email=this.state.getEmail;
    //alert(Email);return false;
    $("#appearence_button").val(Email);
    $('#appearence_button').trigger('click');
  }

  getAroma(){
   // var ID=this.state.getID;
    let Email=this.state.getEmail;
    //console.log(ID);
    $("#aroma_button").val(Email);
    $('#aroma_button').trigger('click');
  }
  getPalate(){
   // var ID=this.state.getID;
    let Email=this.state.getEmail;
   // console.log(ID);
    $("#palate_button").val(Email);
    $('#palate_button').trigger('click');
  }
  getScore(){
   // var ID=this.state.getID;
    let Email=this.state.getEmail;
  //  console.log(ID);
    $("#score_button").val(Email);
    $('#score_button').trigger('click');
  }


render() {
  let localstoragedata = JSON.parse(localStorage.getItem('userData'));

let sessionScript = localstoragedata.sessionData.scriptDetail;
console.log('sessionScript=', sessionScript)

  return (
    
       <div>
       { this.props.sessId == 1 ? (
       
          <div className="participent-emoji">
            <ul className="bottom-links flex-wrap list-group list-group-horizontal mx-auto d-md-flex justify-content-center py-xs-1">
            <div className="dropup">
              <li className="list-group-item bg-transparent border-0 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <a href="#"  onClick={this.getAppearence.bind(this)}>APPEARANCE</a>
              
              <div className="dropdown-menu">
                <div className="d-flex justify-content-between">
                  <a href="#"><img src="images/mushroom.png" /></a>
                  <a href="#"><img src="images/emoji2.png" /></a>
                  <a href="#"><img src="images/emoji3.png" /></a>
                  <a href="#"><img src="images/emoji4.png" /></a>
                </div>
              </div></li>
            </div>
            <div className="dropup">
              <li className="list-group-item bg-transparent border-0 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <a href="#" onClick={this.getAroma.bind(this)}>AROMA</a>
              
              <div className="dropdown-menu">
                <div className="d-flex justify-content-between">
                  <a href="#"><img src="images/mushroom.png" /></a>
                  <a href="#"><img src="images/emoji2.png" /></a>
                  <a href="#"><img src="images/emoji3.png" /></a>
                  <a href="#"><img src="images/emoji4.png" /></a>
                </div>
              </div></li>
            </div>
            <div className="dropup">
              <li className="list-group-item bg-transparent border-0 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <a href="#" onClick={this.getPalate.bind(this)}>PALATE</a>
              
              <div className="dropdown-menu">
                <div className="d-flex justify-content-between">
                  <a href="#"><img src="images/mushroom.png" /></a>
                  <a href="#"><img src="images/emoji2.png" /></a>
                  <a href="#"><img src="images/emoji3.png" /></a>
                  <a href="#"><img src="images/emoji4.png" /></a>
                </div>
              </div></li>
            </div>
            
             
             {/* <li className="list-group-item bg-transparent border-0"><a href="#" onClick={this.getScore.bind(this)}>SCORE</a></li> */}
           </ul>
         </div>
      ) : (
      this.props.sessId == 2 ? (
        <div className="w-75 swiper-fitness-container float-left">
          <div className="d-flex justify-content-between arrow-after align-items-center footer-fitness-script">
           <div className="swiper-container">
              <div className="swiper-wrapper align-items-center fitness-guest">
                <div className="swiper-guest swiper-slide start">              
                  <span>
                    <a href="#">Start</a>
                  </span>
                </div>
              
              
            
                     {
                        sessionScript.map((opt, i) =>
                        
                         
                              <div className="swiper-slide" key={i}>
                                
                                  <div id="countdown" className="count-timer" key={i}>
                                  {opt.attribute.map(function(attrb, index){
                                    if(attrb.attrLabel == 'counter'){
                                    return <div className="countdown-number" key={index}>{attrb.attrValue} SEC</div>;
                                    }
                                  })}

                                  <svg>
                                    <circle r="27" cx="30" cy="30"></circle>
                                  </svg>
                                <h4>{opt.name}</h4>
                                </div>
                                <img src="images/arrow-img.png" />   
                              </div> 
                                 
                  
                        )}
                    <div className="swiper-guest swiper-slide end">              
                      <span>
                        <a href="#">End</a>
                      </span>
                    </div>
              </div>
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

export default connect()(FooterScriptParticipant);