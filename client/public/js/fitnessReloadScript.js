//import FitnessScript from "./src/components/home/FitnessScript";

function startSlider(){
  $('#play-slider').addClass('d-none');
  $('#pause-slider').removeClass('d-none');
    //$(".swiper-slide:nth-child(1)").removeClass("swiper-slide-next");
    //$(".swiper-slide:nth-child(2)").addClass("swiper-slide-next");
    $(".swiper-slide.start a").prop('disabled', true);
    $(".swiper-btn-next").css("display", "block");
    $(".swiper-slide").removeClass("remove-slider-bg");
    $(".start").removeClass("swiper-start");
    countDown();
  }


  // $(document).on("click", ".host-script-section .swiper-container-host .start span a", function(){
  //   startSlider()
  // })

  var countdown = 0;
  var resetCount = null;
  var isPaused = "false";
  //var isparticipentrestart = "false";
  var scriptDuration = 0;

  function countDown(){

    console.log('------isPauseddddddddddd--------',isPaused)

    
    let disCtr = 0;
    if($('#fitness-counter').length > 0){

      disCtr = $('#fitness-counter').html();
      disCtr = disCtr == '' ? 0 : parseInt(disCtr);
      disCtr++;
      $('#fitness-counter').html(disCtr);
    }

    let activeEle = $('.swiper-slide.swiper-slide-next');  

    var countdownNumberEl = activeEle.find('.countdown-number');

    let scriptnameClass = activeEle.find('.scriptName');

    let script_name = scriptnameClass.html();

    console.log('------script_name--------',script_name)

    
    $('#script_name').html(script_name);

    
    var indexNum = parseInt(activeEle.find('.data-slide').attr('data-index'));

    if(activeEle.find('h4').html().toLowerCase() == 'rest'){
      $('.fitness-emoji').removeClass('d-none');
    } else {
      $('.fitness-emoji').addClass('d-none');
    }
    // var countdown = 30;
    // countdown = parseInt(countdownNumberEl.attr("data-number"));
    countdown = parseInt(countdownNumberEl.html());
    scriptDuration = countdown;

    activeEle.find('svg circle').css({"animation":"countdown "+countdown+"s linear infinite forwards", "animation-direction": "reverse"});
    // activeEle.find('svg').css({"animation":"countdown "+countdown+"s linear infinite forwards", "animation-direction": "reverse"});

    var ctrflag = 0;
    resetCount = setInterval(function() {
     
      if(isPaused != true) {

      //activeEle.find('svg circle').attr("style","animation-play-state:running");
      activeEle.find('svg circle').css({"animation-play-state":"running"});

      countdown--;

      countdownNumberEl.html((countdown > 0 ? countdown : 0) + '\ SEC') ;
      $('#script_time').html((countdown > 0 ? countdown : 0) + '\ SEC') ;

      if(countdown < 1){

        activeEle.find('svg circle').removeAttr("style");
        activeEle.find('svg').removeAttr("style");

        clearInterval(resetCount);

        if( $('.swiper-slide .data-slide').length != indexNum ) {
          // Now you can use all slider methods like
          mySwiper.slideNext();
          countDown();
        } else {
          activeEle.find('svg circle').css('animation', 'none')
        }
        
      }
     
    } else {      
      //activeEle.find('svg circle').attr("style","animation-play-state:paused");
      activeEle.find('svg circle').css({"animation-play-state":"paused"});
    }
    }, 1000);
  }


  function loadSwiperSlide(){
    let activeEle = $('.swiper-slide .countdown');

    console.log('-------loadSwiperSlide3333-----------',activeEle.length)
    //let indexNum = parseInt(activeEle.find('.data-slide').find('.countdown-number').attr('data-number'));
     //activeEle.find('.data-slide').find('.countdown-number').html(indexNum + '\ SEC');
    activeEle.find('.countdown-number').each(function(i, val){

      $(this).html( parseInt($(this).attr('data-number')) + '\ SEC')
    });

    let activeEle1 = $('.swiper-slide.swiper-slide-next');
    activeEle1.find('svg circle').removeAttr("style");

    clearInterval(resetCount);
  }

  function loadSwiperSlide1(){
    
    let activeEle = $('.swiper-slide .count-timer');
    console.log('-------loadSwiperSlide3333-----------',activeEle)
    //let indexNum = parseInt(activeEle.find('.data-slide').find('.countdown-number').attr('data-number'));
     //activeEle.find('.data-slide').find('.countdown-number').html(indexNum + '\ SEC');
    activeEle.find('.countdown-number').each(function(i, val){
      //console.log('-----------loadSwiperSlide1111------------------',parseInt($(this).attr('data-number')))
      $(this).html( parseInt($(this).attr('data-number')) + '\ SEC')
    });
    clearInterval(resetCount);
    
  }


  function participentrestart() {

    console.log('----------newhtt333333333------')

    let activeEle = $('.newcounter');
    var indexNum1 = parseInt(activeEle.attr('data1-index'));

    console.log('----------newhtt444444------',indexNum1)

    activeEle.each(function(i, val){
      //console.log('-----------loadSwiperSlide1111------------------',parseInt($(this).attr('data-number')))
     // var indexNum1 = parseInt(activeEle.attr('data1-index'));
      console.log('----------newhtt55555------',parseInt(activeEle.attr('data1-index')))
      if(indexNum1 == 4)
      {
        console.log('----------newhtt666666------',parseInt(activeEle.attr('data1-index')))
      }
     // $(this).html( parseInt($(this).attr('data-number')) + '\ SEC')
    });

  }


  // function guestfitnessScriptStop(code)
  // {
  //   console.log('---------guestfitnessScriptStop--------------')
  //   if(code == 212){
  //     var loadScript = function (src) {
  //     var tag = document.createElement('script');
  //     tag.async = false;
  //     tag.src = src;
      
  //     var body = document.getElementsByTagName('body')[0];
  //     body.appendChild(tag);
  //   }
  //   loadScript('/js/swiper.min.js');
  //   loadScript('/js/swiper-modifier.js');
  //   loadScript('/js/fitnessReloadScript.js');
  //   window.loadSwiperSlide();
  //   window.mySwiper.slideTo(0, 1000, true);
  //   }
  // }


  $(document).ready(function(){
  
    let k=0;
    
      console.log('----------ooooooooooooooooooooooooo---------')
    // $(".host-script-section .swiper-container-host .start span a").click(function(){
    //   console.log('----------klkliiiiiiii---------', k++)
    //   startSlider();
    // })

    //   $('#stop-slider').on('click', function(){
    //     $('#pause-slider').addClass('d-none')
    //     $('#play-slider').removeClass('d-none')
    //     var loadScript = function (src) {
    //       var tag = document.createElement('script');
    //       tag.async = false;
    //       tag.src = src;
          
    //       var body = document.getElementsByTagName('body')[0];
    //       body.appendChild(tag);
    //     }
    //     loadScript('/js/swiper.min.js');
    //     loadScript('/js/swiper-modifier.js');
    //     loadScript('/js/fitnessReloadScript.js');
    //     window.loadSwiperSlide();
    //     window.mySwiper.slideTo(0, 1000, true);
    //  // this.forceUpdate();


    //     let storeData = getCurrentUserData();     
    //     let ftnsStopCode=storeData.rtm.ftnsStop.code;                  
    //     messages=ftnsStopCode+sep;   
    //     console.log('------------ftnessStop--------------',messages)     
    //     sendMessageToChannel(channelName1,messages);
    //   });

  })
