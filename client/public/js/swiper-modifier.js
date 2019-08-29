var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 3,
    paginationClickable: true,
    spaceBetween: 0
});

var mySwiper = document.querySelector('.swiper-container').swiper

$(".swiper-container-horizontal>.swiper-pagination .swiper-pagination-bullet").text("Next").addClass("btn-outline-secondary");
let heightScript = $(".height-script").height();    
    $(".item-description.script-section").height(`${heightScript -60 }px`);
	//$(".host-local").height(`${heightScript}px`);
	$(".host-show-hide").height(`${heightScript -53 }px`);