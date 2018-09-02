$.extend({
  show_thankyou:{
    extraText: "Please describe how you would promote our product, including any relevant affiliate experience and references.",
    initial:function(){
        a = $.show_thankyou;
        var thankMessage=$(".affiliate-thankyou");
        if($.Request.QueryString("thankyou")=="1"){
            thankMessage.addClass("show");
        }
        a.addAdditionalText();
        a.removeForm();
      
    },
    changeImage:function (){
        a = $.show_thankyou;
        $(".footer-copyright img").attr("src", "/pub-assets/images/dmca-white.png");
        //$(".footer-number a").attr("href", "tel:+17163301335");

    },
    addAdditionalText: function(){
        a = $.show_thankyou;
        $( "<p class='extraText'>" + a.extraText + "</p>" ).insertBefore( ".affiliate-form #details" );

    },
    removeForm: function(){
        if($.Request.QueryString("thankyou")){
            $(".section2 .first-row").hide();
        }
    }
  }
});
$(document).ready(function() {
  $.show_thankyou.initial();
  $.show_thankyou.changeImage();
  $(".footer-affiliate a").attr("href", "affiliate-form.html");
  $.convertHref();
});