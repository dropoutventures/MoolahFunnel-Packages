$.extend({
    loader:{
        Request:{
            QueryString: function (item) {
                var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
                var rt = svalue ? svalue[1] : svalue;
                return rt === null? "" : rt;
            }
        },
        timer:null,
        init: function () {
            var a=$.loader;
            if (a.Request.QueryString("loader") === "1") {
                a.loadingPara = {
                    step1: $(".loadingMessageConatinerWrapper .step1").html(),
                    step2: $(".loadingMessageConatinerWrapper .step2").html(),
                    step3: $(".loadingMessageConatinerWrapper .step3").html(),
                    step4: $(".loadingMessageConatinerWrapper .step4").html(),
                    apiLoaded: function () {
                        return ($.completedLoading)?$.completedLoading:true;
                    }
                };
                a.loadingPage = $(".loadingMessageConatinerWrapper");
                a.messageConatiner = $(".messageConatiner");
                a.loadBar = $(".loadingMessageConatinerWrapper .counter .bar");
                if ($(".loadingMessageConatinerWrapper").length === 1) {
                    $("body").append($(".loadingMessageConatinerWrapper"));
                    $(".loadingMessageConatinerWrapper").show();
                    a.timer = setInterval(function () {
                        a.loadingBar(a.loadingPara);
                    }, 50);
                }
            } else {
                $(".loadingMessageConatinerWrapper").remove();
            }
        },
        loadingPara : null,
        loadingPage : null,
        messageConatiner : null,
        loadBar : null,
        counter : 0,
        isPause : false,
        loadingBar : function (option) {
            var a=$.loader;
            if (!a.isPause) {
                a.loadBar.css("width", a.counter + "%");
                if (a.counter === 0) {
                    a.messageConatiner.html(option.step1);
                }
                a.counter++;
                if (a.counter === 30) {
                    a.messageConatiner.html(option.step2);
                    a.isPause = true;
                    setTimeout(function () {
                        a.isPause = false;
                    }, 2000);
                }
                else if (a.counter === 70) {
                    a.messageConatiner.html(option.step3);
                    a.isPause = true;
                    if (option.apiLoaded()) {
                        setTimeout(function () {
                            a.isPause = false;
                        }, 2000);
                    }
                }
                else if (a.counter === 100) {
                    a.messageConatiner.html(option.step4);
                }
                else if (a.counter === 101) {
                    clearInterval(a.timer);
                    setTimeout(function () {
                        a.loadingPage.fadeOut(function () {
                            $(this).remove();
                        });
                    }, 2000);
                }
            }
        }
    }
});

