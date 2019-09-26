var mySwiper;
$(document).ready(function(){
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 3,
    spaceBetween: 0,
    allowSlideNext: true,
    initialSlide: 0,
    //loop: true,
  
    // Responsive breakpoints
  breakpoints: {
    // when window width is <= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    },
    // when window width is <= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    // when window width is <= 640px
    991: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    1920: {
      slidesPerView: 4,
      spaceBetween: 30
    }
  }
    //centerInsufficientSlides: if(slidesPerView <= 3){
        //return true;
    //}
  });
  mySwiper = document.querySelector('.swiper-container').swiper
  $(".swiper-slide:nth-child(2)").addClass("remove-slider-bg");
  $(".swiper-slide:nth-child(1)").addClass("swiper-start");

  if($(".swiper-wrapper .swiper-slide:nth-child(1)").hasClass("swiper-slide-next")){
    $(".swiper-btn-next").css("display", "none")
  } 
  
  $(".swiper-container-horizontal>.swiper-pagination .swiper-pagination-bullet").text("Next").addClass("btn-outline-secondary");
});



