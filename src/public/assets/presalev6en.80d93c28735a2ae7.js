var presalev6 = {
  initial: function() {
        this.replaceTagHTML();
        this.copyRight();
    },
    replaceTagHTML: function () {
        var url = "/en/order-home.html";
        
        var objs = $('body *');
        objs.each(function (index, elm) {
            if ($(elm).children().length === 0 && this.tagName.toLowerCase() != 'script' && this.tagName.toLowerCase() != 'style') {
                $(elm).html(
                    $(elm).html()
                        .replace(/\[CompanyName\]/g, '<a class="txt-stand tracking-link" href="'+ url +'">EnergixCharge</a>')
                        .replace(/\[\{/g, '<h2 class="title">').replace(/\}\]/g, '</h2>')
                        .replace(/\{/g, '<b>').replace(/\}/g, '</b>')
                        .replace(/\[/g, '<span>').replace(/\]/g, '</span>')
                );
            }
        });
        
        $(".section9 .btn-order a").attr("href", url);
    },
    copyRight: function () {
        $('footer .footer-copyright').before('<p class="copyright">© EnergixCharge 2018</p>');
    }
};

$(function() {
    presalev6.initial();
});