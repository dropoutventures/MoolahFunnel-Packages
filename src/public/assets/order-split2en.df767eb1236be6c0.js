webform.webkey = '191b5bef-673b-40cb-a231-a0f862b3d73c';
webform.upsells = ["485beb59-dbc2-4e81-a0ba-facc789229f1"];
$.extend({
    setLocalData: {
        //initial
        initial: function () {
            var chakra = $.setLocalData;
            $('.ctaBtn').click(chakra.saveLocal);
            $('.paypalBtn').click(chakra.saveLocal);
        },
        //save variable saveTotal;
        saveLocal: function () {
            var selectedProduct = $("input[type='radio']:checked").data("info");
            var originalPrice = selectedProduct.productPrices.FullRetailPrice.Value;
            var discountPrice = selectedProduct.productPrices.DiscountedPrice.Value;
            var saveTotal = originalPrice - discountPrice;
            $.Local.set("saveTotal", saveTotal.toFixed(2));
            $.Local.set("creditCardNumber", $(".widget-CreditCardNumber").val());
        }
    },

    RedirectPage: function (page, data, target) {
        var strs = [];
        var qs = location.search.length > 0 ? location.search.substr(1) : "";
        var qc = (page.indexOf("?") > 0) ? page.substr(page.indexOf("?") + 1) : "";
        var qss = qs.split('&');
        var qds = {};
        qss.forEach(function (dt) {
            var key = dt.split('=')[0];
            var value = '';
            try {
                value = dt.split('=')[1];
            } catch (ex) {
                value = '';
            }
            if (key != '') qds[key] = value;
        });
        var qcs = qc.split('&');
        qcs.forEach(function (dt) {
            var key = dt.split('=')[0];
            var value = '';
            try {
                value = dt.split('=')[1];
            } catch (ex) {
                value = '';
            }
            if (key != '') {
                if (qds[key] != undefined) {
                    qds[key] = value;
                } else {
                    qds[key] = value;
                }
            }
        });
        for (var key in data) {
            if (key != '') {
                qds[key] = data[key];
            }
        }
        for (var key in qds) {
            strs.push(key + "=" + qds[key]);
        }
        var str = strs.join("&");

        if (document.location.href.indexOf("test-anno") > 0) {
            var cp = document.location.href.split("/");
            var pg = page.split("/");
            if (page.substr(0, 1) == "/") {
                page = "/test-anno" + page;
            } else if (page.indexOf("://") > 0) {
                pg.splice(3, 0, "test-anno");
                page = pg.join("/");
            }
        } else if (document.location.href.indexOf("test.") > 0 &&
            page.indexOf("dmca.com") == -1 &&
            page.indexOf("facebook.com") == -1 &&
            page.indexOf("twitter.com") == -1 &&
            page.indexOf("instagram.com") == -1) {
            if (page.indexOf("://www.") > 0) {
                page = page.replace("://www.", "://test.");
            } else if (page.indexOf("://") > 0) {
                page = page.replace("://", "://test.");
            }
        }

        if (page.indexOf("?") > 0) {
            page = page.substring(0, page.indexOf('?')) + (str != "" ? ('?' + str) : "");
        } else {
            page = page + (str != "" ? ('?' + str) : "");
        }
        if (target == "_blank") {
            window.open(page);
        } else {
            document.location = page;
        }
        return false;
    },
    order_update: {
        country: "",
        currencyName: "",
        currencyCode: "",
        getData: false,
        initial: function () {
            var a = $.order_update;
            $(".mobile-menu").on("click", function () {
                $(".navigation").toggleClass('show-mobile-menu');
            });
        },
        setCurrency: function () {
            var a = $.order_update;
            var myThread;
            myThread = setInterval(function () {
                var productInfo = $("input[id='Product_17']").data();
                if (Object.keys(productInfo).length > 0) {
                    a.currencyCode = productInfo.info.productPrices.FullRetailPrice.GlobalCurrencyCode;
                    a.country = location.countryCode;

                    var set = {
                        type: "get",
                        showlayer: false
                    }

                    if (!a.currencyCode) {
                        $(".paymentlist .price-dollor p").html("");
                        clearInterval(myThread);
                        return;
                    }

                    if (a.currencyCode.toLowerCase() !== "usd") {
                        $(".paymentlist .price-dollor p").html("");
                    }

                    $.endPoint.Ajax("campaigns/{api}/countries", set, function (response) {
                        if (response != null && response.length > 0) {
                            $(response).each(function () {
                                var dt = this;
                                if (dt.currencyCode == a.currencyCode) {
                                    a.currencyName = dt.currencyName;
                                    a.replaceToken();
                                    return false;
                                }
                            });
                        }
                    });
                    clearInterval(myThread);
                }
            }, 200);
        },
        replaceToken: function () {
            var a = $.order_update;
            var objs = $('body *');
            objs.each(function () {
                //change the info token
                if ($(this).children().length == 0) {
                    $(this).html($(this).html().toString().replace("CurrencyName", a.currencyName));
                }
            });
        },
    }
})
var webapp = {
    init: function (settings) {
        webapp.config = {
            highlightTextContainers: ['.section1-5 h2', '.widget-Warranty-Body', '.sale-off'],
            productRadioListItem: '.productRadioListItem',
            productRadioItem: $('input[name="Product"]'),
            productItem: '#Product_',

        }
        $.extend(webapp.config, settings);
        webapp.setup();
    },
    setup: function () {
        webapp.setupLayout();
        webapp.setDefaultProduct(17);
        webapp.highlight(webapp.config.highlightTextContainers, 'bold');
        webapp.formatPhone();
        webapp.activeAdapterButton();
        webapp.verifiedPapal();
        //webapp.formatHrefPhoneNumber();
        webapp.checkValidateState();
        webapp.setCurrency();
    },
    setupLayout: function () {
        $('div[class*="sale-off__"]').wrapAll("<div class='sale-off'/>");
        $('div[class*="banner-top__"]').wrapAll("<div class='banner-top'/>");
        $('div[class*="banner__"]').wrapAll("<div class='banner'/>");
        $('div[class*="Product_adapter"]').wrapAll("<div class='list-adapters'/>");
        $('.menu-mobile__item').wrapAll("<div class='menu-mobile'/>");
        $('.footer-address').insertAfter('.row.footer-menu');
        $('.icon-visa, .icon-master-card').prependTo('.footer-copyright');
    },
    highlight: function (arrayElements, className) {
        if (arrayElements.length === 0) return;
        arrayElements.forEach(function (element) {
            var newContent = $(element).html().replace(/\*(.*?)\*/g, "<span class=" + className + ">$1</span>");
            $(element).html(newContent);
        });
    },
    setDefaultProduct: function (productId) {
        $(webapp.config.productItem + productId).attr('checked', true);
        $(webapp.config.productItem + productId).parents(webapp.config.productRadioListItem).addClass('checked');
    },
    formatPhone: function () {
        var newHTML = $('.header').html().toString().replace(/_phone_number_/g, "<span><i class='fa fa-phone'></i> " + webform.Phone + "</span>");
        $('.header').html(newHTML);
    },
    activeProductList: function (fromProduct, toProduct, defaultProduct) {
        $(defaultProduct).parents(".productRadioListItem").addClass('checked');
        $(defaultProduct).prop('checked', true);
        if (fromProduct == '.th') {
            $(fromProduct).nextUntil(".productRadioListItem" + toProduct).removeClass('hidden');
            return false;
        }
        $(".productRadioListItem" + fromProduct).nextUntil(".productRadioListItem" + toProduct).removeClass('hidden');
    },
    activeAdapterButton: function () {
        $(".productRadioListItem.Product_21").nextUntil(".step-title").addClass('hidden');
        $('.list-adapters input').change(function () {
            var value = $(this).val();
            var parent = $(this).parents(".radioItem");

            $(".th").nextUntil(".step-title").addClass('hidden');
            $('.productlist .productRadioListItem').removeClass('checked');
            $('.productlist .productRadioListItem input').attr('checked', false);

            if (parent.hasClass('active')) {
                $(this).attr('checked', false);
                parent.removeClass('active');
                //webapp.activeProductList(".th",".Product_32","#Product_17");
                webapp.activeProductList(".th", ".Product_80", "#Product_17");
                return false;
            }

            $('.list-adapters input').parent().removeClass('active');
            $(this).parent().addClass('active');
            if (value == 'adapter1') {
                webapp.activeProductList(".Product_21", ".Product_74", "#Product_80");
            }
            if (value == 'adapter2') {
                webapp.activeProductList(".Product_84", ".Product_75", "#Product_74");
            }
            if (value == 'adapter3') {
                webapp.activeProductList(".Product_72", ".step-title", "#Product_75");
            }
        })
    },
    verifiedPapal: function () {
        $(".widget-PaymentMethod input[value='paypal']").click(function () {
            if ($(this).is(':checked')) {
                if ($('.widget-CreditCardForm-container input').hasClass('input-error')) {
                    $('.widget-CreditCardForm-container input').removeClass('input-error');
                    $('.widget-CreditCardForm-container span.error-message').addClass('hidden');
                }
                if ($('.widget-AddressForm-Container input').hasClass('input-error')) {
                    $('.widget-AddressForm-Container input').removeClass('input-error');
                    $('.widget-AddressForm-Container span.error-message').addClass('hidden');
                }
                if ($('.widget-AddressForm-Container select').hasClass('input-error')) {
                    $('.widget-AddressForm-Container select').removeClass('input-error');
                }
            }
        });
    },
    formatHrefPhoneNumber: function () {
        var phoneNumber = $.trim(($(".contactusphone").text()));
        $(".contactusphone").parent().attr('href', "tel:" + phoneNumber.replace(/ |-/g, ""));
    },
    checkValidateState: function () {
        // Disable validation State/Provine when there are no options
        $(document).ajaxComplete(function (event, request, settings) {
            var responseData = request.responseJSON;
            var url = settings.url;
            if (url.indexOf('countrystates?countryCode') > -1) {
                var states = Object.keys(responseData).length;
                if (states == 0) {
                    $(".widget-AddressForm-Province").removeAttr("required");
                    $("div.widget-AddressForm-Province select").removeClass("input-error");
                    $("div.widget-AddressForm-Province .error-message").addClass("hidden");
                } else {
                    $(".widget-AddressForm-Province").attr("required", true);
                }
            }
        });
    },
    setCurrency: function () {
        var a = $.order_update;
        var myThread;
        myThread = setInterval(function () {
            var productInfo = $("input[id='Product_17']").data();
            if (Object.keys(productInfo).length > 0) {
                a.currencyCode = productInfo.info.productPrices.FullRetailPrice.GlobalCurrencyCode;
                a.country = location.countryCode;

                var set = {
                    type: "get",
                    showlayer: false
                }
                if (!a.currencyCode) {
                    $(".paymentlist .price-dollar p").html("");
                    clearInterval(myThread);
                    return;
                }
                if (a.currencyCode.toLowerCase() !== "usd") {
                    $(".paymentlist .price-dollar p").html("");
                }

                clearInterval(myThread);
            }
        }, 200);
    },
}

$(document).ready(function () {
    webapp.init();
    $.setLocalData.initial();
    $('body .list-adapters input').attr("name", "adapter");
    if ($('.selected-flag .iti-flag')[0].className.length <= 8) {
        $('.selected-flag .iti-flag').addClass('us')
    }
})