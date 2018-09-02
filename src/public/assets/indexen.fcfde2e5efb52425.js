$.extend({
    initial: function(){
        $.replaceToken();
        $.showFloatBtn();
    },
	replaceToken: function(){
        var objs=$('body *');
        objs.each(function(){
            if($(this).children().length==0){
                var result = $(this).html().match(/\{(.*)\}/);
                if (result) {
                    $(this).html($(this).html().toString().replace(result[0], "<span>"+result[1]+"</span>"));
                }
            }
        });
	},
    showFloatBtn: function(){
        $(".floating-button").css("display", "none");
        $(window).scroll(function() {
            if ( $(window).scrollTop() < 500 || ($(window).scrollTop() + $(window).height() > $('.footer').offset().top - $(".50off-button-wrapper").height() - 40)) {
                $(".floating-button").css("display", "none");
            } else {
                $(".floating-button").css("display", "block");
            }
        });
    }
});


$(document).ready(function(){
    $.initial();
    $.convertHref();
    //$(".floating-button").css("display", "block");
    $.getScript('/pub-assets/js/slider.js', function(){
        var tap_slider = new image_slider('tapncharge-slider', 1, true, 5000, 500, true, true);
        $(window).on('load resize', function(){
            tap_slider.update_value(1);
        });
    });
    //$('.sub-img-wrapper').attr('style','');
    $(".footer-copyright img").attr("src", "/pub-assets/images/dmca-white.png");
    //$(".footer-number a").attr("href", "tel:+17163301335");
});