function startSlider(){
    //$(".swiper-slide:nth-child(1)").removeClass("swiper-slide-next");
    //$(".swiper-slide:nth-child(2)").addClass("swiper-slide-next");
    $(".swiper-slide.start a").prop('disabled', true);
    $(".swiper-btn-next").css("display", "block");
    $(".swiper-slide").removeClass("remove-slider-bg");
    $(".start").removeClass("swiper-start");
    countDown();
  }

  function startSlider1(){
    //$(".swiper-slide:nth-child(1)").removeClass("swiper-slide-next");
    //$(".swiper-slide:nth-child(2)").addClass("swiper-slide-next");
    $(".swiper-slide.start a").prop('disabled', true);
    $(".swiper-btn-next").css("display", "block");
    $(".swiper-slide").removeClass("remove-slider-bg");
    $(".start").removeClass("swiper-start");
    countDown1();
  }

  $(document).on("click", ".host-script-section .swiper-container-host .start span a", function(){
   // alert("hi");
    // $(".swiper-slide:nth-child(1)").removeClass("swiper-slide-next");
    // $(".swiper-slide:nth-child(2)").addClass("swiper-slide-next");
    // $(".swiper-slide.start a").prop('disabled', true);
    // $(".swiper-btn-next").css("display", "block")
    // countDown();
    startSlider()
  })

 

  function countDown1(){
    let isPaused = false;
    let disCtr = 0;
    if($('#fitness-counter').length > 0){

      disCtr = $('#fitness-counter').html();
      disCtr = disCtr == '' ? 0 : parseInt(disCtr);
      disCtr++;
      $('#fitness-counter').html(disCtr);
    }

    let activeEle = $('.swiper-slide.swiper-slide-next');
    var countdownNumberEl = activeEle.find('.countdown-number');
    
    var indexNum = parseInt(activeEle.find('.data-slide').attr('data-index'));
    if(activeEle.find('h4').html().toLowerCase() == 'rest'){
      $('.fitness-emoji').removeClass('d-none');
    } else {
      $('.fitness-emoji').addClass('d-none');
    }
    // var countdown = 30;
    countdown = parseInt(countdownNumberEl.attr("data-number"));
    activeEle.find('svg circle').attr("style","animation-duration:"+countdown+"s !important");
    // countdownNumberEl.html(countdown + '\ SEC') ;
    
    // console.log('countdown ======= countdown start ----', countdown)
    var ctrflag = 0;
    resetCount = setInterval(function() {
      if(!isPaused) {
        activeEle.find('svg circle').attr("style","animation-play-state:running");
      // countdown = countdown;
      countdown--;
      // console.log('countdown ======= countdown----', countdown, $('.swiper-slide .data-slide').length , indexNum)
      countdownNumberEl.html((countdown > 0 ? countdown : 0) + '\ SEC') ;
      
      if(countdown < 1){

        console.log('=========== **********', $('.swiper-slide .data-slide').length, indexNum)

        activeEle.find('svg circle').removeAttr("style");
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
      activeEle.find('svg circle').attr("style","animation-play-state:paused");
    }
    }, 1000);
  }

  // var resetCount = '';
  var countdown = 0;
  //var resetCount = null;
 var isPaused = false;
  function countDown(){
    
    let disCtr = 0;
    if($('#fitness-counter').length > 0){

      disCtr = $('#fitness-counter').html();
      disCtr = disCtr == '' ? 0 : parseInt(disCtr);
      disCtr++;
      $('#fitness-counter').html(disCtr);
    }

    let activeEle = $('.swiper-slide.swiper-slide-next');
    var countdownNumberEl = activeEle.find('.countdown-number');
    
    var indexNum = parseInt(activeEle.find('.data-slide').attr('data-index'));
    if(activeEle.find('h4').html().toLowerCase() == 'rest'){
      $('.fitness-emoji').removeClass('d-none');
    } else {
      $('.fitness-emoji').addClass('d-none');
    }
    // var countdown = 30;
    countdown = parseInt(countdownNumberEl.attr("data-number"));
    activeEle.find('svg circle').attr("style","animation-duration:"+countdown+"s !important");
    // countdownNumberEl.html(countdown + '\ SEC') ;
    
    // console.log('countdown ======= countdown start ----', countdown)
    var ctrflag = 0;
    resetCount = setInterval(function() {
      if(!isPaused) {
        activeEle.find('svg circle').attr("style","animation-play-state:running");
      // countdown = countdown;
      countdown--;
      // console.log('countdown ======= countdown----', countdown, $('.swiper-slide .data-slide').length , indexNum)
      countdownNumberEl.html((countdown > 0 ? countdown : 0) + '\ SEC') ;
      
      if(countdown < 1){

        console.log('=========== **********', $('.swiper-slide .data-slide').length, indexNum)

        activeEle.find('svg circle').removeAttr("style");
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
      activeEle.find('svg circle').attr("style","animation-play-state:paused");
    }
    }, 1000);
  }


  function loadSwiperSlide(){
    let activeEle = $('.swiper-slide .countdown');
    //let indexNum = parseInt(activeEle.find('.data-slide').find('.countdown-number').attr('data-number'));
     //activeEle.find('.data-slide').find('.countdown-number').html(indexNum + '\ SEC');
    activeEle.find('.countdown-number').each(function(i, val){
      $(this).html( parseInt($(this).attr('data-number')) + '\ SEC')
    });
    clearInterval(resetCount);

  }



  $(document).ready(function(){
    $(".swiper-guest.start span a").click(function(){
      startSlider1();
    })
  })
