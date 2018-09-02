$.extend({
    cm_term: {
        initial: function() {
            var a = $.cm_term;
            a.replaceToken();
        },
        clearToken: function() {
            var a = $.cm_term;
            var objs = $('body *');
            objs.each(function() {
                if ($(this).children().length == 0) {
                    $(this).html($(this).html().toString().replace(/\{/g, '<h4><strong>').replace(/\}/g, '</strong></h4>'));
                }
            });
        },
        replaceToken: function() {
            $(".footer-copyright img").attr("src", "/pub-assets/images/dmca-white.png");
            var a = $.cm_term;
            var objs = $('body *');
            objs.each(function() {
                if ($(this).children().length == 0) {
                    $(this).html($(this).html().toString().replace(/\{CompanyName\}/g, webform.CompanyName));
                    $(this).html($(this).html().toString().replace(/\{CompanyAddress\}/g, webform.CompanyAddress));
                    $(this).html($(this).html().toString().replace(/\{CompanyWebsite\}/g, '<a href='+webform.CompanyFullWebsite+'>'+webform.CompanyWebsite+'</a>' ));
                    $(this).html($(this).html().toString().replace(/\{SupportEmail\}/g, '<a href=mailto:'+webform.SupportEmail+'>'+webform.SupportEmail+'</a>' ));
                    $(this).html($(this).html().toString().replace(/\{Phone\}/g, webform.Phone));
                    $(this).html($(this).html().toString().replace(/\{ReturnAddress\}/g, webform.ReturnAddress));
                }
            });
            a.clearToken();
        },
    }
});


$(document).ready(function(){
    $.cm_term.initial();
    $(".footer-affiliate a").attr("href", "affiliate-form.html");
    $.convertHref();
});