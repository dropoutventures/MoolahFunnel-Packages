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
            var a = $.cm_term;
            var objs = $('body *');
            objs.each(function() {
                if ($(this).children().length == 0) {
                    $(this).html($(this).html().toString().replace(/\{CompanyName\}/g, webform.CompanyName));
                    $(this).html($(this).html().toString().replace(/\{CompanyAddress\}/g, webform.CompanyAddress));
                    $(this).html($(this).html().toString().replace(/\{CompanyWebsite\}/g, '<a href='+webform.CompanyFullWebsite+'>'+webform.CompanyWebsite+'</a>' ));
                    $(this).html($(this).html().toString().replace(/\{SupportEmail\}/g, '<a href=mailto:'+webform.SupportEmail+'>'+webform.SupportEmail+'</a>' ));
                    $(this).html($(this).html().toString().replace(/\{Phone\}/g, "United States: +1 609 414 7087<br>Canada: +1 778 300 0854<br>United Kingdon & Ireland: +44 8708 200084<br>Australia & New Zealand: +61 2 8607 8316"));
                    $(this).html($(this).html().toString().replace(/\{ReturnAddress\}/g, webform.ReturnAddress));

                }
            });
            a.clearToken();
        },
    }
});


$(document).ready(function(){
    $.cm_term.initial();
    $(".DMCA_Logo > a > img").attr("src","../pub-assets/images/dmca-white.png");
    //$(".footer-menu > .footer-number > a").attr("href","tel:" + webform.Phone);
    $(".footer-affiliate a").attr("href", "affiliate-form.html");
    $.convertHref();
});