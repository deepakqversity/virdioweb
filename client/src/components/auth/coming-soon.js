import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


class ComingSoon extends React.Component {


    componentDidMount(){
        $("body").addClass("coming-soon");


        $(document).ready(function(){
            $(".items-collection label").on("click", function(){
                
                if($(".items-collection label").hasClass("noactive")){
                    $(this).addClass("active")
                    $(this).removeClass("noactive");
                    
                }  else if($(".items-collection label").hasClass("active")) {
                    $(this).removeClass("active")
                    $(this).addClass("noactive1");
                    
                } 
            });
            $(".items-collection label").on("click", function(){
                
            })
        });
    }

    render(){
        
        return(
            

    <div className="black-coming-bg">
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-12 col-12">
              <div className="form-elements">
                <h3>Find out more...</h3>
                <div className="form-group">
                  <input type="text" className="form-control mt-4" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <input type="email" className="form-control mt-4" placeholder="email address" />
                </div>
              </div>
            </div>
            <div className="col-lg-6 my-4 my-lg-0 col-sm-12 col-12">
              <div className="form-elements">
                <h3>What interests you?</h3>
              </div>    
              <div className="items-collection">
                <label className="noactive">
                  <input type="checkbox" />
                  Strength Training
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Yoga
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Fitness
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Wine
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Beauty
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Cooking
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Fishing
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Gardening
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Photography
                </label>
                <label className="noactive">
                  <input type="checkbox" />
                  Travel Tips
                </label>
              </div>
              <div className="form-elements">
                <div className="form-group">
                  <input type="text" className="form-control small-input" placeholder="If other, Please specify..." />
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-12 d-flex align-items-end justify-content-center">
              <a href="#" className="submit-btn"><img src="images/submit.png" />Submit</a>
            </div>
          </div>
        </div>
      </div>
    </div>
        )
    }
}


export default ComingSoon;