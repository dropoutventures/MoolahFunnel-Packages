$.extend({
    setLocal:{
        initial:function(){
            var a=$.setLocal;
            $('.ctaBtn').click(a.saveLocal);
            $('.paypalBtn').click(a.saveLocal);
            $('.section2 .paymentlist .widget-CreditCardForm .widget-CreditCardForm-CreditCardNumber input.widget-CreditCardNumber').attr('type','tel');
            $('footer .footer-copyright .DMCA_Logo img').attr('src','../pub-assets/images/dmca-white.png');
            //$('footer .footer-menu .footer-number a').attr('href','tel:+17163301335');
        },

        saveLocal:function(){
            var a=$.setLocal;
            var selectedProduct = $("input[type='radio']:checked").data("info");
            var originalPrice = selectedProduct.productPrices.FullRetailPrice.Value;
            var discountPrice = selectedProduct.productPrices.DiscountedPrice.Value;
            var saveTotal = originalPrice - discountPrice;
            $.Local.set("saveTotal", saveTotal.toFixed(2));
            $.Local.set("creditCardNumber", $(".widget-CreditCardNumber").val());
        },
    },
    order_update:{
        currency: "",
        getData: false,
        initial: function(){
            var a = $.order_update;
            $(".mobile-menu").on("click", function(){
                $(".navigation").toggleClass('show-mobile-menu');
            });
            a.setCurrency();
            a.exitPop();
        },
        setCurrency: function(){
            var a = $.order_update;
            if (a.getData == false) {
                var getCurrency = setTimeout(function(){
                    a.currency = $.order.price;
                    if (a.currency != null && a.currency.length > 0) {
                        a.getData = true;
                        if (a.currency.replace(/\d+\.?\,?\d*/, "").replace(/\s/, '') == "$") {
                            $('.price-dollor').show();
                        }else{
                            $('.price-dollor').hide();
                        }
                        clearInterval(getCurrency);
                    }
                    
                }, 1000);
            }
        }, 
        /**
         ** Exit-Pop
         **/

        queryString: function queryString(item) {
            var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
            var rt = svalue ? svalue[1] : svalue;
            return rt === null ? "" : rt;
        },
        exitPop: function() {
            var a = $.order_update;
            var setExpopPrice = setInterval(function() {
                var expopData = $('#Product_24').data("info") ? $('#Product_24').data("info") : null;
                if (!!expopData) {
                    clearInterval(setExpopPrice);
                    var expopPrice = expopData.productPrices.DiscountedPrice.FormattedValue;
                    $(".ex_pop_promo_row_1").html($(".ex_pop_promo_row_1").html().replace("ExpopPrice", expopPrice) );
                }
            }, 200);


            var exitPopDynamicValue = function exitPopDynamicValue() {
                // Get data from product
                var getProductData = setInterval(function() {
                    var productData = $('#Product_24').data("info") ? $('#Product_24').data("info") : null;
                    if (!!productData) {
                        clearInterval(getProductData);

                        var productQuantity = productData.quantity;
                        var productFormattedValue = productData.productPrices.DiscountedPrice.FormattedValue;
                        var productValue = productData.productPrices.DiscountedPrice.Value;
                        //var productDiscountPercentage = " 33%";

                        // Insert value based on product data
                        var ele = $('.dyn-container.dyn-value');
                        $(".order-section-header.green").text(productFormattedValue + "!");
                        $(".ex_pop_promo_row_1").replace("ExpopPrice", productFormattedValue);
                        $(ele).children().last().text(productQuantity + "x");
                        //$(ele).children().first().text(productDiscountPercentage);
                        //$('.discount-text').children().first().text(productDiscountPercentage);
                        //$('.section-subheader').children().eq(1).text(productDiscountPercentage);
                    }
                }, 200);
            }

            if (a.queryString("mode") == "1") {
                $("#Product_17").attr("style", "display: none !important");
                $(".Product_17").attr("style", "display: none !important");
                $("#Product_18").attr("style", "display: none !important");
                $(".Product_18").attr("style", "display: none !important");
                $("#Product_19").attr("style", "display: none !important");
                $(".Product_19").attr("style", "display: none !important");
                $("#Product_20").attr("style", "display: none !important");
                $(".Product_20").attr("style", "display: none !important");
                $("#Product_21").attr("style", "display: none !important");
                $(".Product_21").attr("style", "display: none !important");
                $("#Product_24").attr("style", "display: block !important");
                $(".Product_24").attr("style", "display: block !important");
                setInterval(function() {
                    $(".Product_24 input[type=radio]").click();
                }, 1000);
                exitPopDynamicValue();
            }
        }

    }
});
$(document).ready(function(){
    $.setLocal.initial();
    $.order_update.initial();
    $(".footer-affiliate a").attr("href", "affiliate-form.html");
    $("input.widget-CustomerInfor-FirstName, input.widget-CustomerInfor-LastName").prop('required',true);
    $('.widget-PaymentProcess').on("click", function(){
        $(this).find("input").prop('checked', true);
        $(this).find("input").trigger("change");
    });
});