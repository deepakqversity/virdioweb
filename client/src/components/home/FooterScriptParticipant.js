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
    loadScript('/js/fitnessReloadScript.js');
    //this.forceUpdate();
  }

  componentWillMount(){
    //console.log(1);
    // window.test();
   // this.forceUpdate();
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

  handleButtonClick1 = ()=>{
    console.log('--------stopscrpt11111111-------------')
   // window.guestfitScriptStop();
   let loadScript = function (src) {
    var tag = document.createElement('script');
    tag.async = false;
    tag.src = src;
    
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(tag);
  }
  loadScript('/js/swiper.min.js');
  loadScript('/js/swiper-modifier.js');
  loadScript('/js/fitnessReloadScript.js'); 

    window.loadSwiperSlide1();
    window.mySwiper.slideTo(0, 1000, true);
  this.forceUpdate();  
}



render() {
  let localstoragedata = JSON.parse(localStorage.getItem('userData'));

let sessionScript = localstoragedata.sessionData.scriptDetail;
//console.log('sessionScript=', sessionScript)

  return (
    
       <div>
       { this.props.interestId == 1 ? (
       
          <div className="participent-emoji h_auto mb-4">
            <ul className="bottom-links flex-wrap list-group list-group-horizontal mx-auto d-md-flex justify-content-center py-xs-1">
            <div className="dropup">
              <li className="list-group-item bg-transparent border-0 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <a href="#">APPEARANCE</a>
              
              <div className="dropdown-menu">
                <div className="d-flex justify-content-between a1">
                  <a href="#" id="appear1"><img src="images/mushroom.png" /></a>
                  <a href="#" id="appear2"><img src="images/emoji2.png" /></a>
                  <a href="#" id="appear3"><img src="images/emoji3.png" /></a>
                  <a href="#" id="appear4"><img src="images/emoji4.png" /></a>
                </div>
              </div></li>
            </div>
            <div className="dropup">
              <li className="list-group-item bg-transparent border-0 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <a href="#">AROMA</a>
              
              <div className="dropdown-menu">
                <div className="d-flex justify-content-between a2">
                  <a href="#" id="aroma1" ><img src="images/mushroom.png" /></a>
                  <a href="#" id="aroma2"><img src="images/emoji2.png" /></a>
                  <a href="#" id="aroma3"><img src="images/emoji3.png" /></a>
                  <a href="#" id="aroma4"><img src="images/emoji4.png" /></a>
                </div>
              </div></li>
            </div>
            <div className="dropup">
              <li className="list-group-item bg-transparent border-0 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <a href="#">PALATE</a>
                {/* <span>PALATE</span> */}
              
              <div className="dropdown-menu">
                <div className="d-flex justify-content-between a3">
                  <a href="#" id="palate1"><img src="images/mushroom.png" /></a>
                  <a href="#" id="palate2"><img src="images/emoji2.png" /></a>
                  <a href="#" id="palate3"><img src="images/emoji3.png" /></a>
                  <a href="#" id="palate4"><img src="images/emoji4.png" /></a>
                </div>
              </div></li>
            </div>
            
             
             {/* <li className="list-group-item bg-transparent border-0"><a href="#" onClick={this.getScore.bind(this)}>SCORE</a></li> */}
           </ul>
         </div>
      ) : (
      this.props.interestId == 2 ? (
        <div className="w-95 swiper-fitness-container float-left position-relative">
          {/*<div className="fitness-emoji d-none">
            <h3>How are you feeling?</h3>
              <div className="d-flex justify-content-between a3">
                <a href="#" id="like"><img src="images/like.png" />
                  <span>like</span>
                </a>
                <a href="#" id="dislike"><img src="images/dislike.png" />
                <span>dislike</span>
                </a>
                <a href="#" id="easy"><img src="images/easy.png" />
                  <span>easy</span>
                </a>
                <a href="#" id="too-hard"><img src="images/too-hard.png" />
                  <span>TooHard</span>
                </a>
                <a href="#" id="perfect"><img src="images/perfect.png" />
                  <span>perfect</span>
                </a>
                <a href="#" id="awesome"><img src="images/awesome.png" />
                  <span>awesome</span>
                </a>
              </div>
            </div>*/}
           
          <div className="d-flex position-absolute b-10 w-100 justify-content-between arrow-after align-items-center footer-fitness-script">
           <div className="swiper-container">
           <button  id="stop1-script"  onClick={this.handleButtonClick1} className="mr-2 stop-btn" hidden="hidden">fitnessStop</button>
            {/* <a href="#" onClick={this.handleButtonClick1} className="mr-2 stop-btn" id="stop1-script" hidden="hidden">fitnessStop</a> */}
              <div className="swiper-wrapper align-items-center fitness-guest">
                <div className="swiper-guest swiper-slide position-relative start">              
                  <span className="position-relative" id="swip_slide">
                    <a href="#!">Start</a>
                  </span>
                  <div className="prevent-click"></div>
                </div>
                            
            
                     {
                        sessionScript.map((opt, i) =>
                        
                         
                              <div className="swiper-slide newcounter" data-index={i+1} key={i}>
                                  
                                  <div id="countdown" className="count-timer data-slide" data-index={i+1}>
                                  {opt.attribute.map(function(attrb, index){
                                    if(attrb.attrLabel == 'counter'){
                                    return <div className="countdown-number"  data-number={attrb.attrValue} key={index}>{attrb.attrValue} SEC</div>;
                                    }
                                  })}

                                  <svg>
                                    <circle r="30" cx="33" cy="33"></circle>
                                  </svg>
                                <h4>{opt.name}</h4>
                                </div>
                                <img src="images/arrow-img.png" className="arrow-image" /> 
                                
                                
                              </div> 
                                 
                  
                        )}
                    <div className="swiper-guest swiper-slide end">              
                      <span>
                        <a href="#">End</a>
                      </span>
                      <img src="images/arrow-img.png" className="arrow-image" />
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