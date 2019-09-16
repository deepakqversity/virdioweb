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

  }

  componentWillMount(){
    //console.log(1);
    // window.test();
  }

  getAppearence(){  
    var Email=this.state.getEmail;
    //alert(Email);return false;
    $("#appearence_button").val(Email);
    $('#appearence_button').trigger('click');
  }

  getAroma(){
    var ID=this.state.getID;
    console.log(ID);
    $("#aroma_button").val(ID);
    $('#aroma_button').trigger('click');
  }
  getPalate(){
    var ID=this.state.getID;
    console.log(ID);
    $("#palate_button").val(ID);
    $('#palate_button').trigger('click');
  }
  getScore(){
    var ID=this.state.getID;
    console.log(ID);
    $("#score_button").val(ID);
    $('#score_button').trigger('click');
  }


render() {
  let localstoragedata = JSON.parse(localStorage.getItem('userData'));

  return (
    
       <div>
       { this.props.sessId == 1 ? (
       
          <div>
            <ul className="bottom-links flex-wrap list-group list-group-horizontal mx-auto d-md-flex justify-content-center py-xs-1">
   
             <li className="list-group-item bg-transparent border-0"><a href="#"  onClick={this.getAppearence.bind(this)}>APPEARANCE</a></li>
             <li className="list-group-item bg-transparent border-0"><a href="#" onClick={this.getAroma.bind(this)}>AROMA</a></li>
             <li className="list-group-item bg-transparent border-0"><a href="#" onClick={this.getPalate.bind(this)}>PALATE</a></li>
             <li className="list-group-item bg-transparent border-0"><a href="#" onClick={this.getScore.bind(this)}>SCORE</a></li>
           </ul>
         </div>
      ) : (
      this.props.sessId == 2 ? (
          <div className="d-flex justify-content-between w-75 arrow-after align-items-center footer-fitness-script">
            <div id="countdown" className="count-timer">
              <div id="countdown-number"></div>
              <svg>
                <circle r="27" cx="30" cy="30"></circle>
              </svg>
              <h4>Pushups</h4>
            </div>
            <img src="images/arrow-img.png" />
            <div id="countdown" className="count-timer current-box">
              <div id="countdown-number"></div>
              <svg>
                <circle r="27" cx="30" cy="30"></circle>
              </svg>
              <h4>Lunges</h4>
            </div>
            <img src="images/arrow-img.png" />
            <div id="countdown" className="count-timer">
              <div id="countdown-number"></div>
              <svg>
                <circle r="27" cx="30" cy="30"></circle>
              </svg>
              <h4>Rest</h4>
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